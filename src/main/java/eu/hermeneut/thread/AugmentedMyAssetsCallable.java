package eu.hermeneut.thread;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.Container;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.ThreatAgent;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.overview.AugmentedMyAsset;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;

import java.util.*;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

public class AugmentedMyAssetsCallable implements Callable<List<AugmentedMyAsset>> {
    private List<MyAsset> myAssets;
    private AttackStrategyService attackStrategyService;
    private Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap;
    private Set<ThreatAgent> threatAgentSet;
    private Map<Long, Float> levelsOfInterestMap;

    public AugmentedMyAssetsCallable(
        List<MyAsset> myAssets,
        AttackStrategyService attackStrategyService,
        Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap,
        Set<ThreatAgent> threatAgentSet,
        Map<Long, Float> levelsOfInterestMap) {

        this.myAssets = myAssets;
        this.attackStrategyService = attackStrategyService;
        this.augmentedAttackStrategyMap = augmentedAttackStrategyMap;
        this.threatAgentSet = threatAgentSet;
        this.levelsOfInterestMap = levelsOfInterestMap;
    }

    @Override
    public List<AugmentedMyAsset> call() throws Exception {
        List<AugmentedMyAsset> augmentedMyAssets = new ArrayList<>();
        Iterator<MyAsset> myAssetIterator = this.myAssets.iterator();

        //===Loop through MyAssets===
        while (myAssetIterator.hasNext()) {
            MyAsset myAsset = myAssetIterator.next();

            Set<Container> containers = myAsset.getAsset().getContainers();

            if (containers != null && !containers.isEmpty()) {
                Iterator<Container> containerIterator = containers.iterator();

                while (containerIterator.hasNext()) {
                    Container container = containerIterator.next();
                    List<AttackStrategy> attackStrategies = this.attackStrategyService.findAllByContainer(container.getId());

                    if (attackStrategies != null && !attackStrategies.isEmpty()) {
                        Iterator<AttackStrategy> attackStrategyIterator = attackStrategies.iterator();

                        while (attackStrategyIterator.hasNext()) {
                            AttackStrategy attackStrategy = attackStrategyIterator.next();
                            AugmentedAttackStrategy augmentedAttackStrategy = (AugmentedAttackStrategy) augmentedAttackStrategyMap.get(attackStrategy.getId()).clone();

                            //Filter the ThreatAgents that can perform this attack
                            List<ThreatAgent> threatAgentsSubset = threatAgentSet.stream().filter(threatAgent -> ThreatAttackFilter.isAttackPossible(threatAgent, attackStrategy)).collect(Collectors.toList());
                            //For each ThreatAgent build an AugmentedMyAsset
                            if (threatAgentsSubset != null && !threatAgentsSubset.isEmpty()) {
                                Iterator<ThreatAgent> threatAgentIterator = threatAgentsSubset.iterator();

                                //SUM Vulnerability * LevelOfInterest of each ThreatAgent
                                float initialVulnerabilityNumerator = 0F;
                                float contextualVulnerabilityNumerator = 0F;
                                float refinedVulnerabilityNumerator = 0F;

                                //SUM Vulnerability * LevelOfInterest of each ThreatAgent
                                float initialLikelihoodNumerator = 0F;
                                float contextualLikelihoodNumerator = 0F;
                                float refinedLikelihoodNumerator = 0F;

                                //Number of ThreatAgents
                                int denominator = threatAgentsSubset.size();

                                float averageInitialVulnerability = 0F;
                                float averageInitialLikelihood = 0F;

                                float averageContextualVulnerability = 0F;
                                float averageContextualLikelihood = 0F;

                                float averageRefinedVulnerability = 0F;
                                float averageRefinedLikelihood = 0F;

                                while (threatAgentIterator.hasNext()) {
                                    ThreatAgent threatAgent = threatAgentIterator.next();

                                    Float levelOfInterest = levelsOfInterestMap.getOrDefault(threatAgent.getId(), 0F);

                                    Float initialVulnerability = 0F;
                                    Float contextualVulnerability = 0F;
                                    Float refinedVulnerability = 0F;

                                    Float initialLikelihood = 0F;
                                    Float contextualLikelihood = 0F;
                                    Float refinedLikelihood = 0F;

                                    if (augmentedAttackStrategy.getInitialLikelihood() > 0) {
                                        initialVulnerability = augmentedAttackStrategy.getInitialLikelihood();
                                        initialLikelihood = augmentedAttackStrategy.getInitialLikelihood();

                                        initialVulnerabilityNumerator += initialVulnerability * levelOfInterest;
                                        initialLikelihoodNumerator += initialLikelihood * levelOfInterest;
                                    }

                                    if (augmentedAttackStrategy.getContextualVulnerability() > 0 && augmentedAttackStrategy.getContextualLikelihood() > 0) {
                                        contextualVulnerability = augmentedAttackStrategy.getContextualVulnerability();
                                        contextualLikelihood = augmentedAttackStrategy.getContextualLikelihood();

                                        contextualVulnerabilityNumerator += contextualVulnerability * levelOfInterest;
                                        contextualLikelihoodNumerator += contextualLikelihood * levelOfInterest;
                                    }

                                    if (augmentedAttackStrategy.getRefinedVulnerability() > 0 && augmentedAttackStrategy.getRefinedLikelihood() > 0) {
                                        refinedVulnerability = augmentedAttackStrategy.getRefinedVulnerability();
                                        refinedLikelihood = augmentedAttackStrategy.getRefinedLikelihood();

                                        refinedVulnerabilityNumerator += refinedVulnerability * levelOfInterest;
                                        refinedLikelihoodNumerator += refinedLikelihood * levelOfInterest;
                                    }
                                }

                                averageInitialVulnerability = initialVulnerabilityNumerator / denominator;
                                averageInitialLikelihood = initialLikelihoodNumerator / denominator;

                                averageContextualVulnerability = contextualVulnerabilityNumerator / denominator;
                                averageContextualLikelihood = contextualLikelihoodNumerator / denominator;

                                averageRefinedVulnerability = refinedVulnerabilityNumerator / denominator;
                                averageRefinedLikelihood = refinedLikelihoodNumerator / denominator;

                                //Update the likelihood and vulnerabilities of the attack strategy with the averaged values
                                //among all the threat agents.
                                augmentedAttackStrategy.setInitialLikelihood(averageInitialLikelihood);

                                augmentedAttackStrategy.setContextualVulnerability(averageContextualVulnerability);
                                augmentedAttackStrategy.setContextualLikelihood(averageContextualLikelihood);

                                augmentedAttackStrategy.setRefinedVulnerability(averageRefinedVulnerability);
                                augmentedAttackStrategy.setRefinedLikelihood(averageRefinedLikelihood);

                                //Create the augmented my asset
                                AugmentedMyAsset augmentedMyAsset = new AugmentedMyAsset(myAsset);
                                augmentedMyAsset.setAugmentedAttackStrategy(augmentedAttackStrategy);

                                augmentedMyAssets.add(augmentedMyAsset);
                            }
                        }
                    }
                }
            }
        }

        return augmentedMyAssets;
    }
}
