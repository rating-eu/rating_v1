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

package eu.hermeneut.service.impl.dto;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.dto.MyAssetDTO;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.compact.AssetRiskService;
import eu.hermeneut.service.dto.MyAssetDTOService;
import eu.hermeneut.service.result.ResultService;
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
public class MyAssetDTOServiceImpl implements MyAssetDTOService, MaxValues {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private DirectAssetService directAssetService;

    @Autowired
    private IndirectAssetService indirectAssetService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private AssetRiskService assetRiskService;

    @Override
    public Set<MyAssetDTO> findAllBySelfAssessment(Long selfAssessmentID) throws NotFoundException {

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT FOUND.");
        }

        CompanyProfile companyProfile = selfAssessment.getCompanyProfile();

        if (companyProfile == null) {
            throw new NotFoundException("CompanyProfile NOT FOUND.");
        }

        Set<ThreatAgent> threatAgents = this.resultService.getThreatAgents(companyProfile.getId());

        if (threatAgents == null || threatAgents.isEmpty()) {
            throw new NotFoundException("ThreatAgents NOT FOUND.");
        }

        List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgents);
        ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

        ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

        if (myAssets == null || myAssets.isEmpty()) {
            throw new NotFoundException("MyAssets for SelfAssessment with ID = " + selfAssessmentID + " could NOT be FOUND.");
        }

        Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessment.getCompanyProfile().getId());

        //Keep only the attackStrategies that can be performed by the Strongest ThreatAgent
        augmentedAttackStrategyMap = augmentedAttackStrategyMap.values()
            .stream()
            .filter(attackStrategy -> ThreatAttackFilter.isAttackPossible(strongestThreatAgent, attackStrategy))
            .collect(Collectors.toMap(
                augmentedAttackStrategy -> augmentedAttackStrategy.getId(),
                Function.identity()
            ));

        Set<MyAssetDTO> myAssetDTOS = new HashSet<>();

        //For each MyAsset
        for (MyAsset myAsset : myAssets) {
            int impact = myAsset.getImpact() != null ? myAsset.getImpact() : 0;
            float criticality = 0;

            Map<Long, Container> containerMap = this.assetRiskService.getContainerMap(myAsset);

            // For each container
            Triad<Float> maxLikelihoodVulnerabilityCriticality = this.assetRiskService.getMaxLikelihoodVulnerabilityCriticality(augmentedAttackStrategyMap, containerMap);
            criticality = maxLikelihoodVulnerabilityCriticality.getC();

            MyAssetDTO myAssetDTO = new MyAssetDTO();
            myAssetDTO.setMyAssetID(myAsset.getId());
            myAssetDTO.setMyAssetName(myAsset.getAsset().getName());
            myAssetDTO.setCriticality(criticality);
            myAssetDTO.setPriority(myAsset.getRanking());

            // AttackCosts PlaceHolder
            Map<CostType, AttackCost> attackCostsMap = new HashMap<>();

            // Set the first level costs
            Set<AttackCost> directAttackCostsSet = myAsset.getCosts();

            if (directAttackCostsSet != null && !directAttackCostsSet.isEmpty()) {

                attackCostsMap.putAll(directAttackCostsSet
                    .stream()
                    .parallel()
                    .collect(Collectors.toMap(
                        AttackCost::getType,
                        Function.identity()
                    )));
            }

            // Check if it's Direct
            DirectAsset directAsset = this.directAssetService.findOneByMyAssetID(selfAssessmentID, myAsset.getId());

            if (directAsset != null) {
                // Get the IdirectAssets
                Set<IndirectAsset> indirectAssets = directAsset.getEffects();

                if (indirectAssets != null && !indirectAssets.isEmpty()) {
                    // Set the IndirectAssets
                    Set<MyAsset> indirectMyAssetsSet = indirectAssets
                        .stream()
                        .map(IndirectAsset::getMyAsset)
                        .collect(Collectors.toSet());

                    myAssetDTO.setIndirectAssets(indirectMyAssetsSet);

                    // Add the Indirect Costs
                    indirectAssets
                        .stream()
                        .parallel()
                        .forEach(indirectAsset -> {
                                Set<AttackCost> indirectCostsSet = indirectAsset.getMyAsset().getCosts();

                                if (indirectCostsSet != null && !indirectCostsSet.isEmpty()) {

                                    attackCostsMap.putAll(indirectCostsSet
                                        .stream()
                                        .parallel()
                                        .collect(Collectors.toMap(
                                            AttackCost::getType,
                                            Function.identity()
                                        )));
                                }
                            }
                        );
                }
            }

            // Set the related Costs
            Set<AttackCost> attackCosts = attackCostsMap.values().stream().parallel().collect(Collectors.toSet());
            myAssetDTO.setAttackCosts(attackCosts);

            // Add it to the
            myAssetDTOS.add(myAssetDTO);
        }

        return myAssetDTOS;
    }
}
