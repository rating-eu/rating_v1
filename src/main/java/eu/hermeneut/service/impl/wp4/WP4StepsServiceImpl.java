package eu.hermeneut.service.impl.wp4;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.wp4.MyAssetAttackChance;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.wp4.WP4StepsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class WP4StepsServiceImpl implements WP4StepsService {
    private final Logger log = LoggerFactory.getLogger(WP4StepsServiceImpl.class);


    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @Override
    public List<MyAssetAttackChance> getAttackChances(Long selfAssessmentID, Long myAssetID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT Found!!!");
        }

        MyAsset myAsset = this.myAssetService.findOneByIDAndSelfAssessment(myAssetID, selfAssessmentID);

        if (myAsset == null) {
            throw new NotFoundException("MyAsset NOT Found!!!");
        }

        // GET the Containers
        Map<Long, Container> containersMap = myAsset.getAsset().getContainers()
            .stream()
            .parallel()
            .collect(Collectors.toMap(Container::getId, Function.identity()));

        // ADD the Domains of Influence
        myAsset.getAsset().getDomainsOfInfluences()
            .stream()
            .parallel()
            .forEach(domainOfInfluence -> {
                Container container = domainOfInfluence.getContainer();
                containersMap.put(container.getId(), container);
            });


        //Map used to update the likelihood of an AttackStrategy in time O(1).
        Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap =
            this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessmentID);

        //KEEP only the AttackStrategies that can attack the MyAsset (through containers)
        augmentedAttackStrategyMap = augmentedAttackStrategyMap.values()
            .stream()
            .parallel()
            .filter(augmentedAttackStrategy -> {

                Set<Container> attackContainers = augmentedAttackStrategy.getLevels()
                    .stream()
                    .parallel()
                    .map(level -> level.getContainer())
                    .collect(Collectors.toSet());


                attackContainers.retainAll(containersMap.values().stream().parallel().collect(Collectors.toSet()));

                return !attackContainers.isEmpty();
            })
            .collect(
                Collectors.toMap(AugmentedAttackStrategy::getId, Function.identity())
            );

        //WEIGHT the AttackStrategies by the LevelOfInterest of the Threat Agents
        augmentedAttackStrategyMap = this.augmentedAttackStrategyService.weightAugmentedAttackStrategyMap(selfAssessmentID, augmentedAttackStrategyMap);

        //Building output
        List<MyAssetAttackChance> myAssetAttackChances = new ArrayList<>();

        for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {

            AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();
            AttackStrategy attackStrategy = augmentedAttackStrategy;

            MyAssetAttackChance attackChance = new MyAssetAttackChance();
            attackChance.setMyAsset(myAsset);
            attackChance.setAttackStrategy(attackStrategy);

            if (augmentedAttackStrategy.getRefinedLikelihood() > 0F) {
                attackChance.setLikelihood(augmentedAttackStrategy.getRefinedLikelihood());
                attackChance.setVulnerability(augmentedAttackStrategy.getRefinedVulnerability());
            } else if (augmentedAttackStrategy.getContextualLikelihood() > 0F) {
                attackChance.setLikelihood(augmentedAttackStrategy.getContextualLikelihood());
                attackChance.setVulnerability(augmentedAttackStrategy.getContextualVulnerability());
            } else if (augmentedAttackStrategy.getInitialLikelihood() > 0F) {
                attackChance.setLikelihood(augmentedAttackStrategy.getInitialLikelihood());
                attackChance.setVulnerability(augmentedAttackStrategy.getInitialLikelihood());
            }

            float critical = attackChance.getLikelihood() * attackChance.getVulnerability();
            attackChance.setCritical(critical);

            myAssetAttackChances.add(attackChance);
        }

        return myAssetAttackChances;
    }
}
