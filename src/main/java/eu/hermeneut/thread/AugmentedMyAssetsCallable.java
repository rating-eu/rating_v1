package eu.hermeneut.thread;

import eu.hermeneut.domain.*;
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
    private Map<Long, AugmentedAttackStrategy> weightedAugmentedAttackStrategyMap;
    private Set<ThreatAgent> threatAgentSet;

    public AugmentedMyAssetsCallable(
        List<MyAsset> myAssets,
        AttackStrategyService attackStrategyService,
        Map<Long, AugmentedAttackStrategy> weightedAugmentedAttackStrategyMap,
        Set<ThreatAgent> threatAgentSet) {

        this.myAssets = myAssets;
        this.attackStrategyService = attackStrategyService;
        this.weightedAugmentedAttackStrategyMap = weightedAugmentedAttackStrategyMap;
        this.threatAgentSet = threatAgentSet;
    }

    @Override
    public List<AugmentedMyAsset> call() throws Exception {
        List<AugmentedMyAsset> augmentedMyAssets = new ArrayList<>();
        Iterator<MyAsset> myAssetIterator = this.myAssets.iterator();

        //===Loop through MyAssets===
        while (myAssetIterator.hasNext()) {
            MyAsset myAsset = myAssetIterator.next();

            Set<Container> containers = myAsset.getAsset().getContainers();
            Set<Container> domains = myAsset.getAsset().getDomainsOfInfluences().stream().parallel().map(domainOfInfluence -> domainOfInfluence.getContainer()).collect(Collectors.toSet());

            if (containers == null) {
                containers = new HashSet<>();
            }

            //ADD the Domains
            if (domains != null) {
                containers.addAll(domains);
            }

            if (containers != null && !containers.isEmpty()) {
                Iterator<Container> containerIterator = containers.iterator();

                //For each container
                while (containerIterator.hasNext()) {
                    Container container = containerIterator.next();
                    List<AttackStrategy> attackStrategiesByContainer = this.attackStrategyService.findAllByContainer(container.getId());

                    if (attackStrategiesByContainer != null && !attackStrategiesByContainer.isEmpty()) {
                        Iterator<AttackStrategy> attackStrategyIterator = attackStrategiesByContainer.iterator();

                        //For each attack-strategy
                        while (attackStrategyIterator.hasNext()) {
                            AttackStrategy attackStrategy = attackStrategyIterator.next();
                            AugmentedAttackStrategy weightedAugmentedAttackStrategy = (AugmentedAttackStrategy) weightedAugmentedAttackStrategyMap.get(attackStrategy.getId()).clone();

                            //Filter the ThreatAgents that can perform this attack
                            List<ThreatAgent> threatAgentsSubset = threatAgentSet.stream().filter(threatAgent -> ThreatAttackFilter.isAttackPossible(threatAgent, attackStrategy)).collect(Collectors.toList());
                            //For each ThreatAgent build an AugmentedMyAsset
                            if (threatAgentsSubset != null && !threatAgentsSubset.isEmpty()) {
                                //Create the augmented my asset
                                AugmentedMyAsset augmentedMyAsset = new AugmentedMyAsset(myAsset);
                                augmentedMyAsset.setAugmentedAttackStrategy(weightedAugmentedAttackStrategy);

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
