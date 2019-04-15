package eu.hermeneut.service.impl.attacks;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.attacks.CriticalAttackStrategy;
import eu.hermeneut.domain.compact.output.CriticalityType;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.CriticalityService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.attacks.CriticalAttackStrategyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CriticalAttackStrategyServiceImpl implements CriticalAttackStrategyService, MaxValues {
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @Autowired
    private CriticalityService criticalityService;

    @Override
    public List<CriticalAttackStrategy> getCriticalAttackStrategies(Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        Map<Long, CriticalAttackStrategy> criticalAttackStrategyMap = new HashMap<>();

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT FOUND!!!");
        }

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

        if (myAssets == null || myAssets.isEmpty()) {
            throw new NotFoundException("MyAssets NOT FOUND!!!");
        }

        Map<Long/*Container ID*/, Map<Long, Asset>> assetsInContainerMap = new HashMap<>();

        for (MyAsset myAsset : myAssets) {//Count the Assets in each container.
            Asset asset = myAsset.getAsset();

            Collection<Container> containers = asset.getContainers();

            if (containers != null && !containers.isEmpty()) {
                containers.forEach(container -> {
                    Map<Long, Asset> assetsInCurrentContainer = assetsInContainerMap.get(container.getId());

                    if (assetsInCurrentContainer == null) {//Create and set it the first time
                        assetsInCurrentContainer = new HashMap<>();
                        assetsInContainerMap.put(container.getId(), assetsInCurrentContainer);
                    }

                    assetsInCurrentContainer.put(asset.getId(), asset);
                });
            }
        }

        Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessmentID);

        if (augmentedAttackStrategyMap != null) {
            augmentedAttackStrategyMap.values().forEach(augmentedAttackStrategy -> {
                final CriticalAttackStrategy criticalAttackStrategy = new CriticalAttackStrategy(augmentedAttackStrategy);

                final float initialLikelihood = augmentedAttackStrategy.getInitialLikelihood();
                final float initialVulnerability = augmentedAttackStrategy.getInitialLikelihood();
                final float initialCriticality = augmentedAttackStrategy.getInitialCriticality();

                checkBeforeSet(criticalAttackStrategy, initialLikelihood, initialVulnerability, initialCriticality);

                final float contextualLikelihood = augmentedAttackStrategy.getContextualLikelihood();
                final float contextualVulnerability = augmentedAttackStrategy.getContextualVulnerability();
                final float contextualCriticality = augmentedAttackStrategy.getContextualCriticality();

                checkBeforeSet(criticalAttackStrategy, contextualLikelihood, contextualVulnerability, contextualCriticality);

                final float refinedLikelihood = augmentedAttackStrategy.getRefinedLikelihood();
                final float refinedVulnerability = augmentedAttackStrategy.getRefinedVulnerability();
                final float refinedCriticality = augmentedAttackStrategy.getRefinedCriticality();

                checkBeforeSet(criticalAttackStrategy, refinedLikelihood, refinedVulnerability, refinedCriticality);

                //Count the Assets possibly affected by this AttackStrategy
                //Pay attention to duplicates (Assets in multiple containers)
                final Set<Level> attackLevels = augmentedAttackStrategy.getLevels();
                final Map<Long/*AssetID*/, Asset> targetAssetsMap = new HashMap<>();

                for (Level level : attackLevels) {
                    Container container = level.getContainer();
                    Map<Long/*AssetID*/, Asset> assetsInContainer = assetsInContainerMap.get(container.getId());

                    if (assetsInContainer != null && !assetsInContainer.isEmpty()) {
                        assetsInContainer.values().stream().forEach(asset -> {
                            //This way assets in multiple containers are considered only once.s
                            targetAssetsMap.put(asset.getId(), asset);
                        });
                    }
                }

                criticalAttackStrategy.setTargetAssets(targetAssetsMap.size());

                // Set criticalities from Sensors
                Criticality awarenessCriticality = this.criticalityService
                    .findOneByCompanyProfileAttackStrategyAndCriticalityType(
                        selfAssessment.getCompanyProfile().getId(),
                        augmentedAttackStrategy.getId(),
                        CriticalityType.AWARENESS
                    );

                if (awarenessCriticality != null) {
                    criticalAttackStrategy.setAwarenessCriticalityPercentage(awarenessCriticality.getCriticality());
                }

                Criticality socCriticality = this.criticalityService
                    .findOneByCompanyProfileAttackStrategyAndCriticalityType(
                        selfAssessment.getCompanyProfile().getId(),
                        augmentedAttackStrategy.getId(),
                        CriticalityType.SOC
                    );

                if (socCriticality != null) {
                    criticalAttackStrategy.setSocCriticalityPercentage(socCriticality.getCriticality());
                }

                // Calculate the Alert
                Float criticalityPercentage = criticalAttackStrategy.getCriticalityPercentage();
                int criticalityWeight = 1;
                System.out.println("CriticalityPercentage: " + criticalityPercentage);
                
                Float awarenessCriticalityPercentage = criticalAttackStrategy.getAwarenessCriticalityPercentage();
                int awarenessWeight = 1;
                System.out.println("AwarenessCriticalityPercentage: " + awarenessCriticalityPercentage);
                
                Float socCriticalityPercentage = criticalAttackStrategy.getSocCriticalityPercentage();
                int socWeight = 2;
                System.out.println("SOCCriticalityPercentage: " + socCriticalityPercentage);

                Float alertNumerator = 0F;
                Float alertDenominator = 0F;

                if (criticalityPercentage != null) {
                    alertNumerator += criticalityPercentage * criticalityWeight;
                    alertDenominator += criticalityWeight;
                }

                if (awarenessCriticalityPercentage != null) {
                    alertNumerator += awarenessCriticalityPercentage * awarenessWeight;
                    alertDenominator += awarenessWeight;
                }

                if (socCriticalityPercentage != null) {
                    alertNumerator += socCriticalityPercentage * socWeight;
                    alertDenominator += socWeight;
                }

                System.out.println("Alert numerator: " + alertNumerator);
                System.out.println("Alert denominator: " + alertDenominator);

                if (alertDenominator > 0) {
                    Float alert = alertNumerator / alertDenominator;
                    criticalAttackStrategy.setAlertPercentage(alert);
                }

                criticalAttackStrategyMap.put(augmentedAttackStrategy.getId(), criticalAttackStrategy);
            });
        }

        return criticalAttackStrategyMap.values().parallelStream().collect(Collectors.toList());
    }

    private void checkBeforeSet(CriticalAttackStrategy criticalAttackStrategy, float likelihood, float vulnerability, float criticality) {
        if (likelihood > 0 && vulnerability > 0 && criticality > 0) {
            criticalAttackStrategy.setLikelihood(likelihood);
            criticalAttackStrategy.setVulnerability(vulnerability);
            criticalAttackStrategy.setCriticality(criticality);

            criticalAttackStrategy.setCriticalityPercentage(criticality / MAX_CRITICALITY);
        }
    }
}
