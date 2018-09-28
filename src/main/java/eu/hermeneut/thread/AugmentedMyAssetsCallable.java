package eu.hermeneut.thread;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.Container;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.ThreatAgent;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.overview.AugmentedMyAsset;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

public class AugmentedMyAssetsCallable implements Callable<List<AugmentedMyAsset>> {

    private static final Logger LOGGER = LoggerFactory.getLogger(AugmentedMyAssetsCallable.class);

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

                            //TODO Filter the ThreatAgents that can perform this attack
                            List<ThreatAgent> threatAgentsSubset = threatAgentSet.stream().filter(threatAgent -> ThreatAttackFilter.isAttackPossible(threatAgent, attackStrategy)).collect(Collectors.toList());
                            //TODO For each ThreatAgent build an AugmentedMyAsset
                            if (threatAgentsSubset != null && !threatAgentsSubset.isEmpty()) {
                                Iterator<ThreatAgent> threatAgentIterator = threatAgentsSubset.iterator();

                                while (threatAgentIterator.hasNext()) {
                                    ThreatAgent threatAgent = threatAgentIterator.next();

                                    AugmentedMyAsset augmentedMyAsset = new AugmentedMyAsset(myAsset);
                                    augmentedMyAsset.setAugmentedAttackStrategy(augmentedAttackStrategy);
                                    augmentedMyAsset.setThreatAgent(threatAgent);

                                    augmentedMyAssets.add(augmentedMyAsset);
                                    LOGGER.debug("Thread: " + Thread.currentThread().getName() + " augmentedMyAssets: " + augmentedMyAssets.size());
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
