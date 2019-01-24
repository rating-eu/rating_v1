package eu.hermeneut.utils.likelihood.attackstrategy;

import eu.hermeneut.domain.Answer;
import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.MyAnswer;
import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.enumeration.*;
import eu.hermeneut.service.AnswerWeightService;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import org.apache.commons.math3.util.Precision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class AttackStrategyCalculator {
    private static Logger logger = LoggerFactory.getLogger(AttackStrategyCalculator.class);

    //#############INITIAL LIKELIHOOD MATRIX###############
    private AttackStrategyLikelihood[][] initialLikelihoodMatrix;

    @Autowired
    private AnswerCalculator answerCalculator;

    @Autowired
    public AttackStrategyCalculator(AnswerWeightService answerWeightService) {
        //#############INITIAL LIKELIHOOD MATRIX###############
        this.initialLikelihoodMatrix = this.toInitialLikelihoodMatrix();
    }

    //###################################INITIAL LIKELIHOOD###################################

    /**
     * Calculates the Initial Likelihood given an AttackStrategy, based on its Frequency and Resources.
     *
     * @param attackStrategy the AttackStrategy to calculate the InitialLikelihood for.
     * @return the Initial Likelihood of the given AttackStrategy.
     */
    public AttackStrategyLikelihood initialLikelihood(AttackStrategy attackStrategy) {
        return this.initialLikelihood(attackStrategy.getFrequency(), attackStrategy.getResources());
    }

    private AttackStrategyLikelihood initialLikelihood(Frequency frequency, ResourceLevel resourceLevel) {
        return this.initialLikelihoodMatrix[frequency.getValue() - 1][resourceLevel.getValue() - 1];
    }

    public void calculateRefinedLikelihoods(List<MyAnswer> myAnswers, Map<Long/*QuestionID*/, Question> questionsMap, Map<Long/*AnswerID*/, Answer> answersMap, Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap) {
        //Group the MyAnswers by AttackStrategy and find the likelihood for each of them.
        Map<AugmentedAttackStrategy, Set<MyAnswer>> attackAnswersMap = new HashMap<>();

        this.buildAttackAnswersMap(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap, attackAnswersMap);

        for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
            AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();
            logger.debug("AugmentedAttackStrategy: " + augmentedAttackStrategy);

            Set<MyAnswer> myAnswerSet = attackAnswersMap.get(augmentedAttackStrategy);
            logger.debug("MyAnswerSet: " + myAnswerSet);

            if (myAnswerSet != null) {

                final float refinedVulnerability = this.answerCalculator.getAnswersLikelihood(myAnswerSet);

                if (refinedVulnerability != 0F) {
                    augmentedAttackStrategy.setRefinedVulnerability(Precision.round(refinedVulnerability, 2));
                } else {
                    augmentedAttackStrategy.setRefinedVulnerability(Precision.round(augmentedAttackStrategy.getInitialLikelihood(), 2));
                }

                augmentedAttackStrategy.setRefinedLikelihood(Precision.round((augmentedAttackStrategy.getInitialLikelihood() + augmentedAttackStrategy.getRefinedVulnerability()) / 2, 2));
            }
        }
    }

    private void buildAttackAnswersMap(List<MyAnswer> myAnswers, Map<Long, Question> questionsMap, Map<Long, Answer> answersMap, Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap, Map<AugmentedAttackStrategy, Set<MyAnswer>> attackAnswersMap) {
        for (MyAnswer myAnswer : myAnswers) {
            Question question = myAnswer.getQuestion();
            logger.debug("Question: " + question);
            Question fullQuestion = questionsMap.get(question.getId());
            logger.debug("Full question: " + fullQuestion);

            Answer answer = myAnswer.getAnswer();
            logger.debug("Answer: " + answer);
            Answer fullAnswer = answersMap.get(myAnswer.getAnswer().getId());
            logger.debug("FullAnswer: " + fullAnswer);

            myAnswer.setQuestion(fullQuestion);
            myAnswer.setAnswer(fullAnswer);

            Set<AttackStrategy> attacks = fullQuestion.getAttackStrategies();
            logger.debug("Attacks: " + attacks);

            for (AttackStrategy attackStrategy : attacks) {
                AugmentedAttackStrategy augmentedAttackStrategy = augmentedAttackStrategyMap.get(attackStrategy.getId());

                if (attackAnswersMap.containsKey(augmentedAttackStrategy)) {
                    Set<MyAnswer> myAnswerSet = attackAnswersMap.get(augmentedAttackStrategy);
                    myAnswerSet.add(myAnswer);
                } else {
                    Set<MyAnswer> myAnswerSet = new HashSet<>();
                    myAnswerSet.add(myAnswer);
                    attackAnswersMap.put(augmentedAttackStrategy, myAnswerSet);
                }
            }
        }
    }

    public void calculateContextualLikelihoods(List<MyAnswer> myAnswers, Map<Long/*QuestionID*/, Question> questionsMap, Map<Long/*AnswerID*/, Answer> answersMap, Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap) {
        //Group the MyAnswers by AttackStrategy and find the likelihood for each of them.
        Map<AugmentedAttackStrategy, Set<MyAnswer>> attackAnswersMap = new HashMap<>();

        this.buildAttackAnswersMap(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap, attackAnswersMap);

        for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
            AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();
            logger.debug("AugmentedAttackStrategy: " + augmentedAttackStrategy);

            Set<MyAnswer> myAnswerSet = attackAnswersMap.get(augmentedAttackStrategy);
            logger.debug("MyAnswerSet: " + myAnswerSet);

            if (myAnswerSet != null) {
                final float contextualVulnerability = this.answerCalculator.getAnswersLikelihood(myAnswerSet);

                if (contextualVulnerability != 0F) {
                    augmentedAttackStrategy.setContextualVulnerability(Precision.round(contextualVulnerability, 2));
                } else {
                    augmentedAttackStrategy.setContextualVulnerability(Precision.round(augmentedAttackStrategy.getInitialLikelihood(), 2));
                }

                augmentedAttackStrategy.setContextualLikelihood(Precision.round((augmentedAttackStrategy.getInitialLikelihood() + augmentedAttackStrategy.getContextualVulnerability()) / 2, 2));
            } else {
                //TODO Same as InitialLikelihood ???
            }
        }
    }

    //###################################HELPER METHODS###################################
    private AttackStrategyLikelihood[][] toInitialLikelihoodMatrix() {
        Frequency frequencies[] = Frequency.values();
        Arrays.sort(frequencies, new Comparator<Frequency>() {
            @Override
            public int compare(Frequency f1, Frequency f2) {
                //Non decreasing order
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
                //Non ascending order
                //[HIGH, MEDIUM, LOW]
                return r2.getValue() - r1.getValue();
            }
        });

        logger.debug("Resources: " + Arrays.toString(resourceLevels));

        AttackStrategyLikelihood likelihoods[] = AttackStrategyLikelihood.values();
        Map<Integer, AttackStrategyLikelihood> likelihoodMap = Arrays.stream(likelihoods).collect(Collectors.toMap(AttackStrategyLikelihood::getValue, item -> item));
        AttackStrategyLikelihood[][] initialLikelihoodMatrix = new AttackStrategyLikelihood[frequencies.length][resources.length];

        for (Frequency frequency : frequencies) {
            int rowIndex = frequency.getValue();
            int likelihoodIndex = frequency.getValue();

            for (ResourceLevel resource : resources) {
                int columnIndex = resource.getValue();

                AttackStrategyLikelihood likelihood = likelihoodMap.get(likelihoodIndex++);
                /*We need to remove 1 from the index, since the matrix indexes starts from 0,
                 *while the enums starts from value 1.
                 */
                initialLikelihoodMatrix[rowIndex - 1][resourceLevels.length - columnIndex] = likelihood;
            }
        }

        return initialLikelihoodMatrix;
    }
}
