package eu.hermeneut.utils.likelihood;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.*;
import eu.hermeneut.domain.result.AttackMap;
import eu.hermeneut.domain.result.AugmentedAttackStrategy;
import eu.hermeneut.utils.attackstrategy.AttackStrategyFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

public class LikelihoodCalculator {

    private static Logger logger = LoggerFactory.getLogger(LikelihoodCalculator.class);
    private static AttackStrategyLikelihood[/*Frequency*/][/*Resource*/] INITIAL_LIKELIHOOD_MATRIX;

    private static void init() {
        Frequency frequencies[] = Frequency.values();
        Arrays.sort(frequencies, new Comparator<Frequency>() {
            @Override
            public int compare(Frequency f1, Frequency f2) {
                //[LOW, MEDIUM, HIGH]
                return f1.getValue() - f2.getValue();
            }
        });

        logger.debug("Frequencies: " + Arrays.toString(frequencies));

        ResourceLevel resources[] = ResourceLevel.values();
        ResourceLevel resourceLevels[] = ResourceLevel.values();
        Arrays.sort(resourceLevels, new Comparator<ResourceLevel>() {
            @Override
            public int compare(ResourceLevel r1, ResourceLevel r2) {
                //[HIGH, MEDIUM, LOW]
                return r2.getValue() - r1.getValue();
            }
        });

        logger.debug("Resources: " + Arrays.toString(resourceLevels));

        AttackStrategyLikelihood likelihoods[] = AttackStrategyLikelihood.values();
        Map<Integer, AttackStrategyLikelihood> likelihoodMap = Arrays.stream(likelihoods).collect(Collectors.toMap(AttackStrategyLikelihood::getValue, item -> item));
        INITIAL_LIKELIHOOD_MATRIX = new AttackStrategyLikelihood[frequencies.length][resources.length];

        for (Frequency frequency : frequencies) {
            int rowIndex = frequency.getValue();
            int likelihoodIndex = frequency.getValue();

            for (ResourceLevel resource : resources) {
                int columnIndex = resource.getValue();

                AttackStrategyLikelihood likelihood = likelihoodMap.get(likelihoodIndex++);
                /*We need to remove 1 from the index, since the matrix indexes starts from 0,
                 *while the enums starts from value 1.
                 */
                INITIAL_LIKELIHOOD_MATRIX[rowIndex - 1][resourceLevels.length - columnIndex] = likelihood;
            }
        }

        logger.debug("\nINITIAL_LIKELIHOOD_MATRIX:");
        logger.debug(Arrays.toString(INITIAL_LIKELIHOOD_MATRIX[0]));
        logger.debug(Arrays.toString(INITIAL_LIKELIHOOD_MATRIX[1]));
        logger.debug(Arrays.toString(INITIAL_LIKELIHOOD_MATRIX[2]));
    }

    static {
        init();
    }

    /**
     * Calculates the Initial Likelihood given an AttackStrategy, based on its Frequency and Resources.
     *
     * @param attackStrategy the AttackStrategy to calculate the InitialLikelihood for.
     * @return the Initial Likelihood of the given AttackStrategy.
     */
    public static AttackStrategyLikelihood initialLikelihood(AttackStrategy attackStrategy) {
        return initialLikelihood(attackStrategy.getFrequency(), attackStrategy.getResources());
    }

    private static AttackStrategyLikelihood initialLikelihood(Frequency frequency, ResourceLevel resourceLevel) {
        return INITIAL_LIKELIHOOD_MATRIX[frequency.getValue() - 1][resourceLevel.getValue() - 1];
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
    public static float overallInitialLikelihoodByThreatAgent(ThreatAgent threatAgent, AttackMap attackMap) {

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
                phaseAttackSet = phaseAttackSet.stream().filter(augmentedAttackStrategy -> AttackStrategyFilter.isAttackPossible(threatAgent, augmentedAttackStrategy)).collect(Collectors.toSet());

                AugmentedAttackStrategy localMax = null;

                for (AugmentedAttackStrategy attackStrategy : phaseAttackSet) {
                    //Set the status to Enabled since they have already been filtered above.
                    attackStrategy.setEnabled(true);

                    //Set the Initial Likelihood of the AttackStrategy
                    float likelihood = LikelihoodCalculator.initialLikelihood(attackStrategy).getValue();
                    attackStrategy.setInitialLikelihood(likelihood);

                    if (localMax == null) {
                        localMax = attackStrategy;
                    } else {
                        if (likelihood > localMax.getInitialLikelihood()) {
                            localMax = attackStrategy;
                        }
                    }
                }

                if (phaseMaxMap.containsKey(phase)) {
                    AugmentedAttackStrategy currentMax = phaseMaxMap.get(phase);

                    if (localMax.getInitialLikelihood() > currentMax.getInitialLikelihood()) {
                        phaseMaxMap.put(phase, localMax);
                    }
                } else {
                    phaseMaxMap.put(phase, localMax);
                }
            }
        }

        //Calculate the likelihood
        float numerator = 0;
        float denominator = 0;
        for (Map.Entry<Phase, AugmentedAttackStrategy> entry : phaseMaxMap.entrySet()) {
            Phase phase = entry.getKey();
            float likelihood = entry.getValue().getInitialLikelihood();

            numerator += phase.getWeight() * likelihood;
            denominator += phase.getWeight();
        }

        if (denominator != 0) {
            return numerator / denominator;
        } else {
            return 0;
        }
    }

    public static float overallContextualLikelihoodByThreatAgent(ThreatAgent threatAgent, AttackMap attackMap) {

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
                phaseAttackSet = phaseAttackSet.stream().filter(augmentedAttackStrategy -> AttackStrategyFilter.isAttackPossible(threatAgent, augmentedAttackStrategy)).collect(Collectors.toSet());

                AugmentedAttackStrategy localMax = null;

                for (AugmentedAttackStrategy attackStrategy : phaseAttackSet) {
                    //Set the status to Enabled since they have already been filtered above.
                    attackStrategy.setEnabled(true);

                    //GET the  Likelihood of the AttackStrategy
                    float likelihood = attackStrategy.getContextualLikelihood();

                    if (localMax == null) {
                        localMax = attackStrategy;
                    } else {
                        if (likelihood > localMax.getContextualLikelihood()) {
                            localMax = attackStrategy;
                        }
                    }
                }

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

        //Calculate the likelihood
        float numerator = 0;
        float denominator = 0;
        for (Map.Entry<Phase, AugmentedAttackStrategy> entry : phaseMaxMap.entrySet()) {
            Phase phase = entry.getKey();
            float likelihood = entry.getValue().getContextualLikelihood();

            numerator += phase.getWeight() * likelihood;
            denominator += phase.getWeight();
        }

        if (denominator != 0) {
            return numerator / denominator;
        } else {
            return 0;
        }
    }

    /**
     * Calculates the likelihood of the given answers.
     * Important: all the given MyAnswers must be linked to a SINGLE AttackStrategy for the result to make sense.
     *
     * @param attackStrategyMyAnswers The answers about the AttackStrategy
     * @param answerWeightsMap        The Map with the weights of the different types of answers (QuestionType X AnswerType).
     * @return the likelihood of the given MyAnswers about a single AttackStrategy.
     */
    public static float answersLikelihood(Set<MyAnswer> attackStrategyMyAnswers, Map<QuestionType, Map<AnswerLikelihood, AnswerWeight>> answerWeightsMap) {
        float numerator = 0;
        float denominator = 0;

        for (MyAnswer myAnswer : attackStrategyMyAnswers) {
            QuestionType questionType = myAnswer.getQuestion().getQuestionType();
            AnswerLikelihood answerLikelihood = myAnswer.getAnswer().getLikelihood();
            AnswerWeight answerWeight = getAnswerWeight(questionType, answerLikelihood, answerWeightsMap);

            numerator += answerWeight.getWeight() * answerLikelihood.getValue();
            denominator += answerWeight.getWeight();
        }

        if (denominator > 0) {
            return numerator / denominator;
        } else {
            return 0;
        }
    }

    public static AnswerWeight getAnswerWeight(QuestionType questionType, AnswerLikelihood answerLikelihood, Map<QuestionType, Map<AnswerLikelihood, AnswerWeight>> answerWeightsMap) {

        if (answerWeightsMap.containsKey(questionType)) {
            Map<AnswerLikelihood, AnswerWeight> internalMap = answerWeightsMap.get(questionType);

            if (internalMap.containsKey(answerLikelihood)) {
                AnswerWeight answerWeight = internalMap.get(answerLikelihood);
                return answerWeight;
            }
        }

        return null;
    }
}
