/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.service.impl.compact;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.compact.input.AssetRisk;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.compact.AssetRiskService;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
import eu.hermeneut.utils.tuple.Triad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssetRiskServiceImpl implements AssetRiskService, MaxValues {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Override
    public Set<AssetRisk> getAssetRisks(Long selfAssessmentID) throws NotFoundException {
        if (selfAssessmentID == null) {
            throw new NotFoundException("SelfAssessment with ID = " + selfAssessmentID + " could NOT be FOUND.");
        }

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID = " + selfAssessmentID + " could NOT be FOUND.");
        }

        Set<ThreatAgent> threatAgents = selfAssessment.getThreatagents();

        if (threatAgents == null || threatAgents.isEmpty()) {
            throw new NotFoundException("ThreatAgent for SelfAssessment with ID = " + selfAssessmentID + " could NOT be FOUND.");
        }

        List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgents);
        ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

        ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

        if (myAssets == null || myAssets.isEmpty()) {
            throw new NotFoundException("MyAssets for SelfAssessment with ID = " + selfAssessmentID + " could NOT be FOUND.");
        }

        Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessmentID);

        //Keep only the attackstrategies that can be performed by the Strongest ThreatAgent
        augmentedAttackStrategyMap = augmentedAttackStrategyMap.values()
            .stream()
            .filter(attackStrategy -> ThreatAttackFilter.isAttackPossible(strongestThreatAgent, attackStrategy))
            .collect(Collectors.toMap(
                augmentedAttackStrategy -> augmentedAttackStrategy.getId(),
                Function.identity()
            ));

        final Set<AssetRisk> assetRisks = new HashSet<>();

        //For each MyAsset
        for (MyAsset myAsset : myAssets) {
            int impact = myAsset.getImpact() != null ? myAsset.getImpact() : 0;
            float critical = 0;

            final Set<Container> containers = myAsset.getAsset().getContainers() != null ? myAsset.getAsset().getContainers() : new HashSet<>();
            final Set<DomainOfInfluence> domainsOfInfluence = myAsset.getAsset().getDomainsOfInfluences() != null ? myAsset.getAsset().getDomainsOfInfluences() : new HashSet<>();

            Map<Long, Container> containerMap = new HashMap<>();

            containers.stream().parallel().forEach(container -> {
                containerMap.put(container.getId(), container);
            });

            domainsOfInfluence.stream().parallel().forEach(domainOfInfluence -> {
                containerMap.put(domainOfInfluence.getContainer().getId(), domainOfInfluence.getContainer());
            });

            if (containerMap.isEmpty()) {
                throw new NotFoundException("Containers NOT Found!!!");
            }

            if (containerMap != null && !containerMap.isEmpty()) {
                //For each container
                critical = getMaxLikelihoodVulnerabilityCriticality(augmentedAttackStrategyMap, containerMap).getC();

                float risk = critical * impact;
                risk = risk / MAX_RISK;

                AssetRisk assetRisk = new AssetRisk();

                assetRisk.setId(myAsset.getAsset().getId());
                assetRisk.setName(myAsset.getAsset().getName());
                assetRisk.setDescription(myAsset.getAsset().getDescription());
                assetRisk.setAssetCategory(myAsset.getAsset().getAssetcategory());

                assetRisk.setRisk(risk);

                assetRisks.add(assetRisk);
            }
        }

        return assetRisks;
    }

    public Triad<Float> getMaxLikelihoodVulnerabilityCriticality(Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap, Map<Long, Container> containers) {
        //(Likelihood, Vulnerability, Critical)
        Triad<Float> likelihoodVulnerabilityCriticality = new Triad<>(0F, 0F, 0F);

        for (Container container : containers.values()) {
            List<AttackStrategy> attackStrategies = this.attackStrategyService.findAllByContainer(container.getId());

            //For each attack strategy
            for (AttackStrategy attackStrategy : attackStrategies) {
                AugmentedAttackStrategy augmentedAttackStrategy = augmentedAttackStrategyMap.get(attackStrategy.getId());

                if (augmentedAttackStrategy != null) {
                    float currentLikelihood = 0;
                    float currentVulnerability = 0;
                    float currentCriticality = 0;

                    float refinedVulnerability = augmentedAttackStrategy.getRefinedVulnerability();
                    float refinedLikelihood = augmentedAttackStrategy.getRefinedLikelihood();

                    float contextualVulnerability = augmentedAttackStrategy.getContextualVulnerability();
                    float contextualLikelihood = augmentedAttackStrategy.getContextualLikelihood();

                    float initialLikelihood = augmentedAttackStrategy.getInitialLikelihood();

                    if (refinedLikelihood > 0 && refinedVulnerability > 0) {
                        currentLikelihood = refinedLikelihood;
                        currentVulnerability = refinedVulnerability;
                        currentCriticality = refinedLikelihood * refinedVulnerability;
                    } else if (contextualLikelihood > 0 && contextualVulnerability > 0) {
                        currentLikelihood = contextualLikelihood;
                        currentVulnerability = contextualVulnerability;
                        currentCriticality = contextualLikelihood * contextualVulnerability;
                    } else if (initialLikelihood > 0) {
                        currentLikelihood = initialLikelihood;
                        currentVulnerability = initialLikelihood;
                        currentCriticality = initialLikelihood * initialLikelihood;
                    }

                    if (currentLikelihood > likelihoodVulnerabilityCriticality.getA()
                        &&
                        currentVulnerability > likelihoodVulnerabilityCriticality.getB()
                        &&
                        currentCriticality > likelihoodVulnerabilityCriticality.getC()) {

                        likelihoodVulnerabilityCriticality.setA(currentLikelihood);
                        likelihoodVulnerabilityCriticality.setB(currentVulnerability);
                        likelihoodVulnerabilityCriticality.setC(currentCriticality);
                    }
                }
            }
        }

        return likelihoodVulnerabilityCriticality;
    }
}
