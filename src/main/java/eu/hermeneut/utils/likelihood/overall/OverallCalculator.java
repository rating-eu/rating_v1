package eu.hermeneut.utils.likelihood.overall;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AttackMap;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.utils.attackstrategy.AttackStrategyFilter;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class OverallCalculator {

    private static Logger logger = LoggerFactory.getLogger(OverallCalculator.class);
    private AttackStrategyCalculator attackStrategyCalculator;
    // TODO make it dynamic
    public static final int DENOMINATOR = 1 + 1 + 1 + 5 + 1 + 1;

    @Autowired
    public OverallCalculator(AttackStrategyCalculator attackStrategyCalculator) {
        this.attackStrategyCalculator = attackStrategyCalculator;
    }

    /**
     * Calculates the Overall Initial Likelihood,
     * taking into account all the possible AttackStrategies
     * against the identified ThreatAgent.
     *
     * @param threatAgent
     * @param attackMap
     * @return
     */
    public float overallInitialLikelihoodByThreatAgent(ThreatAgent threatAgent, AttackMap attackMap) {

        //Placeholder to store the Max of each Attack phase.
        Map<Phase, AugmentedAttackStrategy> phaseMaxMap = new HashMap<>();

        for (Map.Entry<Level, Map<Phase, Set<AugmentedAttackStrategy>>> entry : attackMap.entrySet()) {
            Level level = entry.getKey();
            logger.debug("Level: " + level);

            Map<Phase, Set<AugmentedAttackStrategy>> internalMap = entry.getValue();

            for (Map.Entry<Phase, Set<AugmentedAttackStrategy>> internalEntry : internalMap.entrySet()) {
                Phase phase = internalEntry.getKey();
                logger.debug("Phase: " + phase);

                Set<AugmentedAttackStrategy> phaseAttackSet = internalEntry.getValue();
                //Remove attacks that are not feasible by the ThreatAgent
                //Warning: it may contain no AttackStrategy if the ThreatAgent has low skills.
                phaseAttackSet = phaseAttackSet.stream().filter(augmentedAttackStrategy -> AttackStrategyFilter.isAttackPossible(threatAgent, augmentedAttackStrategy)).collect(Collectors.toSet());

                //Warning: it may remain NULL if the ThreatAgent has low skills.
                AugmentedAttackStrategy localMax = null;

                for (AugmentedAttackStrategy attackStrategy : phaseAttackSet) {
                    //Set the status to Enabled since they have already been filtered above.
                    attackStrategy.setEnabled(true);

                    //Set the Initial Likelihood of the AttackStrategy
                    float likelihood = this.attackStrategyCalculator.initialLikelihood(attackStrategy).getValue();
                    attackStrategy.setInitialLikelihood(likelihood);

                    if (localMax == null) {
                        localMax = attackStrategy;
                    } else {
                        if (likelihood > localMax.getInitialLikelihood()) {
                            localMax = attackStrategy;
                        }
                    }
                }

                //Important: check if the localMax is not null (has been updated)
                if (localMax != null) {
                    if (phaseMaxMap.containsKey(phase)) {
                        logger.debug("Phase: " + phase);
                        for (Map.Entry<Phase, AugmentedAttackStrategy> entry1 : phaseMaxMap.entrySet()) {
                            logger.debug("Phase: " + entry1.getKey());
                            logger.debug("AugmentedAttackStrategy: " + entry1.getValue());
                        }

                        AugmentedAttackStrategy currentMax = phaseMaxMap.get(phase);
                        logger.debug("CurrentMax: " + currentMax);
                        logger.debug("LocalMax: " + localMax);

                        if (localMax.getInitialLikelihood() > currentMax.getInitialLikelihood()) {
                            phaseMaxMap.put(phase, localMax);
                        }
                    } else {//First iteration
                        phaseMaxMap.put(phase, localMax);
                    }
                }
            }
        }

        //Calculate the likelihood
        float numerator = 0;
        String numerator$ = "";
        float denominator = 0;
        String denominator$ = "";
        for (Map.Entry<Phase, AugmentedAttackStrategy> entry : phaseMaxMap.entrySet()) {
            Phase phase = entry.getKey();
            float likelihood = entry.getValue().getInitialLikelihood();

            numerator += phase.getWeight() * likelihood;
            numerator$ += " + " + phase.getWeight() + " * " + likelihood;

            denominator += phase.getWeight();
            denominator$ += " + " + phase.getWeight();
        }

        logger.debug("Numerator: " + numerator$);
        logger.debug("Denominator: " + denominator$);

        return numerator / DENOMINATOR;
    }

    public float overallContextualLikelihoodByThreatAgent(ThreatAgent threatAgent, AttackMap attackMap) {

        //Placeholder to store the Max of each Attack phase.
        Map<Phase, AugmentedAttackStrategy> phaseMaxMap = new HashMap<>();

        for (Map.Entry<Level, Map<Phase, Set<AugmentedAttackStrategy>>> entry : attackMap.entrySet()) {
            Level level = entry.getKey();
            logger.debug("Level: " + level);

            Map<Phase, Set<AugmentedAttackStrategy>> internalMap = entry.getValue();

            for (Map.Entry<Phase, Set<AugmentedAttackStrategy>> internalEntry : internalMap.entrySet()) {
                Phase phase = internalEntry.getKey();
                logger.debug("Phase: " + phase);

                Set<AugmentedAttackStrategy> phaseAttacksSet = internalEntry.getValue();
                //Remove attacks that are not feasible by the ThreatAgent
                //Warning: it may contain no AttackStrategy if the ThreatAgent has low skills.
                phaseAttacksSet = phaseAttacksSet.stream().filter(augmentedAttackStrategy -> AttackStrategyFilter.isAttackPossible(threatAgent, augmentedAttackStrategy)).collect(Collectors.toSet());

                //Warning: it may remain NULL if the ThreatAgent has low skills.
                AugmentedAttackStrategy localMax = null;

                for (AugmentedAttackStrategy attackStrategy : phaseAttacksSet) {
                    //Set the status to Enabled since they have already been filtered above.
                    attackStrategy.setEnabled(true);

                    //GET the  Likelihood of the AttackStrategy
                    float likelihood = attackStrategy.getContextualLikelihood();

                    if (localMax == null) {//First iteration
                        localMax = attackStrategy;
                    } else {
                        if (likelihood > localMax.getContextualLikelihood()) {
                            localMax = attackStrategy;
                        }
                    }
                }

                //Important: check if the localMax is not null (has been updated)
                if (localMax != null) {
                    if (phaseMaxMap.containsKey(phase)) {
                        AugmentedAttackStrategy currentMax = phaseMaxMap.get(phase);

                        if (localMax.getContextualLikelihood() > currentMax.getContextualLikelihood()) {
                            phaseMaxMap.put(phase, localMax);
                        }
                    } else {
                        phaseMaxMap.put(phase, localMax);
                    }
                }
            }
        }

        //Calculate the likelihood
        float numerator = 0;
        float denominator = 0;
        for (Map.Entry<Phase, AugmentedAttackStrategy> entry : phaseMaxMap.entrySet()) {
            Phase phase = entry.getKey();
            float likelihood = entry.getValue().getContextualLikelihood();

            numerator += phase.getWeight() * likelihood;
            denominator += phase.getWeight();
        }

        return numerator / DENOMINATOR;
    }

    public float overallRefinedLikelihoodByThreatAgent(ThreatAgent threatAgent, AttackMap attackMap) {
        //Placeholder to store the Max of each Attack phase.
        Map<Phase, AugmentedAttackStrategy> phaseMaxMap = new HashMap<>();

        for (Map.Entry<Level, Map<Phase, Set<AugmentedAttackStrategy>>> entry : attackMap.entrySet()) {
            Level level = entry.getKey();
            logger.debug("Level: " + level);

            //Phase attacks
            Map<Phase, Set<AugmentedAttackStrategy>> phaseAttacksMap = entry.getValue();

            for (Map.Entry<Phase, Set<AugmentedAttackStrategy>> phaseAttacks : phaseAttacksMap.entrySet()) {
                Phase phase = phaseAttacks.getKey();
                logger.debug("Phase: " + phase);

                Set<AugmentedAttackStrategy> phaseAttacksSet = phaseAttacks.getValue();
                //Remove attacks that are not feasible by the ThreatAgent
                //Warning: it may contain no AttackStrategy if the ThreatAgent has low skills.
                phaseAttacksSet = phaseAttacksSet.stream().filter(augmentedAttackStrategy -> AttackStrategyFilter.isAttackPossible(threatAgent, augmentedAttackStrategy)).collect(Collectors.toSet());

                //Warning: it may remain NULL if the ThreatAgent has low skills.
                AugmentedAttackStrategy localMax = null;

                for (AugmentedAttackStrategy attackStrategy : phaseAttacksSet) {
                    //Set the status to Enabled since they have already been filtered above.
                    attackStrategy.setEnabled(true);

                    //GET the  Likelihood of the AttackStrategy
                    float likelihood = attackStrategy.getRefinedLikelihood();

                    if (localMax == null) {//First iteration
                        localMax = attackStrategy;
                    } else {
                        if (likelihood > localMax.getContextualLikelihood()) {
                            localMax = attackStrategy;
                        }
                    }
                }

                //Important: check if the localMax is not null (has been updated)
                if (localMax != null) {
                    if (phaseMaxMap.containsKey(phase)) {
                        AugmentedAttackStrategy currentMax = phaseMaxMap.get(phase);

                        if (localMax.getRefinedLikelihood() > currentMax.getRefinedLikelihood()) {
                            phaseMaxMap.put(phase, localMax);
                        }
                    } else {
                        phaseMaxMap.put(phase, localMax);
                    }
                }
            }
        }

        //Calculate the likelihood
        float numerator = 0;
        float denominator = 0;
        for (Map.Entry<Phase, AugmentedAttackStrategy> entry : phaseMaxMap.entrySet()) {
            Phase phase = entry.getKey();
            float likelihood = entry.getValue().getRefinedLikelihood();

            numerator += phase.getWeight() * likelihood;
            denominator += phase.getWeight();
        }

        return numerator / DENOMINATOR;
    }
}
