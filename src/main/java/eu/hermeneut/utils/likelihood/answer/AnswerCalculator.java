package eu.hermeneut.utils.likelihood.answer;

import eu.hermeneut.domain.AnswerWeight;
import eu.hermeneut.domain.MyAnswer;
import eu.hermeneut.domain.enumeration.AnswerLikelihood;
import eu.hermeneut.domain.enumeration.QuestionType;
import eu.hermeneut.service.AnswerWeightService;
import org.apache.commons.math3.util.Precision;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class AnswerCalculator {
    //#############ANSWER WEIGHTS###############
    private AnswerWeightService answerWeightService;
    private List<AnswerWeight> answerWeights;
    private Map<QuestionType, Map<AnswerLikelihood, AnswerWeight>> answerWeightsMap;

    @Autowired
    public AnswerCalculator(AnswerWeightService answerWeightService) {
        //#############ANSWER WEIGHTS###############
        this.answerWeightService = answerWeightService;
        this.answerWeights = this.answerWeightService.findAll();
        this.answerWeightsMap = this.toAnswerWeightsMap(this.answerWeights);
    }

    //###################################ANSWER WEIGHTS#######################################
    public AnswerWeight getAnswerWeight(QuestionType questionType, AnswerLikelihood answerLikelihood) {

        if (this.answerWeightsMap.containsKey(questionType)) {
            Map<AnswerLikelihood, AnswerWeight> internalMap = this.answerWeightsMap.get(questionType);

            if (internalMap.containsKey(answerLikelihood)) {
                AnswerWeight answerWeight = internalMap.get(answerLikelihood);
                return answerWeight;
            }
        }

        return null;
    }

    //###################################ANSWERS LIKELIHOOD#######################################

    /**
     * Calculates the likelihood of the given answers.
     * Important: all the given MyAnswers must be linked to a SINGLE AttackStrategy for the result to make sense.
     *
     * @param myAnswers The answers about the AttackStrategy
     * @return the likelihood of the given MyAnswers about a single AttackStrategy.
     */
    public float getAnswersLikelihood(Set<MyAnswer> myAnswers) {
        float numerator = 0;
        float denominator = 0;

        for (MyAnswer myAnswer : myAnswers) {
            QuestionType questionType = myAnswer.getQuestion().getQuestionType();
            AnswerLikelihood answerLikelihood = myAnswer.getAnswer().getLikelihood();
            AnswerWeight answerWeight = this.getAnswerWeight(questionType, answerLikelihood);

            numerator += answerWeight.getWeight() * answerLikelihood.getValue();
            denominator += answerWeight.getWeight();
        }

        if (denominator > 0) {
            return Precision.round(numerator / denominator, 2);
        } else {
            return 0;
        }
    }

    //###################################HELPER METHODS###################################
    private Map<QuestionType, Map<AnswerLikelihood, AnswerWeight>> toAnswerWeightsMap(List<AnswerWeight> answerWeights) {
        Map<QuestionType, Map<AnswerLikelihood, AnswerWeight>> answerWeightsMap = new HashMap<>();

        for (AnswerWeight answerWeight : answerWeights) {
            QuestionType questionType = answerWeight.getQuestionType();
            AnswerLikelihood answerLikelihood = answerWeight.getLikelihood();

            if (answerWeightsMap.containsKey(questionType)) {
                Map<AnswerLikelihood, AnswerWeight> internalMap = answerWeightsMap.get(questionType);

                internalMap.put(answerLikelihood, answerWeight);
            } else {
                Map<AnswerLikelihood, AnswerWeight> internalMap = new HashMap<>();
                internalMap.put(answerLikelihood, answerWeight);
                answerWeightsMap.put(questionType, internalMap);
            }
        }

        return answerWeightsMap;
    }
}
