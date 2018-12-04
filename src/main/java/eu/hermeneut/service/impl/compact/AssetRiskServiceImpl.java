package eu.hermeneut.service.impl.compact;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.compact.AssetRiskService;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
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

            Set<Container> containers = myAsset.getAsset().getContainers();

            if (containers != null && !containers.isEmpty()) {
                //For each container
                for (Container container : containers) {
                    List<AttackStrategy> attackStrategies = this.attackStrategyService.findAllByContainer(container.getId());

                    //For each attack strategy
                    for (AttackStrategy attackStrategy : attackStrategies) {
                        AugmentedAttackStrategy augmentedAttackStrategy = augmentedAttackStrategyMap.get(attackStrategy.getId());

                        if (augmentedAttackStrategy != null) {
                            float currentCritical = 0;

                            float refinedVulnerability = augmentedAttackStrategy.getRefinedVulnerability();
                            float refinedLikelihood = augmentedAttackStrategy.getRefinedLikelihood();

                            float contextualVulnerability = augmentedAttackStrategy.getContextualVulnerability();
                            float contextualLikelihood = augmentedAttackStrategy.getContextualLikelihood();

                            float initialLikelihood = augmentedAttackStrategy.getInitialLikelihood();

                            if (refinedLikelihood > 0 && refinedLikelihood > 0) {
                                currentCritical = refinedLikelihood * refinedVulnerability;
                            } else if (contextualLikelihood > 0 && contextualVulnerability > 0) {
                                currentCritical = contextualLikelihood * contextualVulnerability;
                            } else if (initialLikelihood > 0) {
                                currentCritical = initialLikelihood * initialLikelihood;
                            }

                            if (currentCritical > critical) {
                                critical = currentCritical;
                            }
                        }
                    }
                }

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
}