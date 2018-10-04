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

    public AugmentedMyAssetsCallable(
        List<MyAsset> myAssets,
        AttackStrategyService attackStrategyService,
        Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap, Set<ThreatAgent> threatAgentSet) {

        this.myAssets = myAssets;
        this.attackStrategyService = attackStrategyService;
        this.augmentedAttackStrategyMap = augmentedAttackStrategyMap;
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

            if (containers != null && !containers.isEmpty()) {
                Iterator<Container> containerIterator = containers.iterator();

                while (containerIterator.hasNext()) {
                    Container container = containerIterator.next();
                    List<AttackStrategy> attackStrategies = this.attackStrategyService.findAllByContainer(container.getId());

                    if (attackStrategies != null && !attackStrategies.isEmpty()) {
                        Iterator<AttackStrategy> attackStrategyIterator = attackStrategies.iterator();

                        while (attackStrategyIterator.hasNext()) {
                            AttackStrategy attackStrategy = attackStrategyIterator.next();
                            AugmentedAttackStrategy augmentedAttackStrategy = augmentedAttackStrategyMap.get(attackStrategy.getId());

                            //Filter the ThreatAgents that can perform this attack
                            List<ThreatAgent> threatAgentsSubset = threatAgentSet.stream().filter(threatAgent -> ThreatAttackFilter.isAttackPossible(threatAgent, attackStrategy)).collect(Collectors.toList());
                            //For each ThreatAgent build an AugmentedMyAsset
                            if (threatAgentsSubset != null && !threatAgentsSubset.isEmpty()) {
                                Iterator<ThreatAgent> threatAgentIterator = threatAgentsSubset.iterator();

                                //Run it only once, since the likelihoods & vulnerability would be the same for all
                                // of them
                                if (threatAgentIterator.hasNext()) {
                                    //No need to reference the ThreatAgent since it has no impact on the L&V values
                                    //ThreatAgent threatAgent = threatAgentIterator.next();

                                    AugmentedMyAsset augmentedMyAsset = new AugmentedMyAsset(myAsset);
                                    augmentedMyAsset.setAugmentedAttackStrategy(augmentedAttackStrategy);

                                    augmentedMyAssets.add(augmentedMyAsset);
                                }
                            }
                        }
                    }
                }
            }
        }

        return augmentedMyAssets;
    }
}
