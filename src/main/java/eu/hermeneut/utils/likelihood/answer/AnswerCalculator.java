/*
 * Copyright 2019 HERMENEUT Consortium
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.utils.likelihood.answer;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.AnswerLikelihood;
import eu.hermeneut.domain.enumeration.ContainerType;
import eu.hermeneut.domain.enumeration.QuestionType;
import eu.hermeneut.service.AnswerWeightService;
import org.apache.commons.math3.util.Precision;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

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
     * Calculates the vulnerability of the given answers.
     * Important: all the given MyAnswers must be linked to a SINGLE AttackStrategy for the result to make sense.
     *
     * @param myAnswers The answers about the AttackStrategy
     * @return the vulnerability of the given MyAnswers about a single AttackStrategy.
     */
    public float getAnswersVulnerability(Set<MyAnswer> myAnswers) {
        float numerator = 0;
        float denominator = 0;

        for (MyAnswer myAnswer : myAnswers) {
            QuestionType questionType = myAnswer.getQuestion().getQuestionType();
            AnswerLikelihood vulnerability = myAnswer.getAnswer().getLikelihood();
            AnswerWeight answerWeight = this.getAnswerWeight(questionType, vulnerability);

            numerator += answerWeight.getWeight() * vulnerability.getValue();
            denominator += answerWeight.getWeight();
        }

        if (denominator > 0) {
            return Precision.round(numerator / denominator, 2);
        } else {
            return 0;
        }
    }

    public float getAnswersVulnerability(Set<MyAnswer> myAnswers, ContainerType containerType) {
        Set<MyAnswer> myAnswersByContainer = new HashSet<>();

        // Filter the MyAnswers
        myAnswersByContainer = myAnswers.stream().parallel().filter((myAnswer) -> {
            Question question = myAnswer.getQuestion();

            if (question != null) {
                Set<AttackStrategy> attackStrategies = question.getAttackStrategies();

                if (attackStrategies != null && !attackStrategies.isEmpty()) {
                    boolean isContainerMatching = false;

                    for (AttackStrategy attackStrategy : attackStrategies) {
                        Set<Level> levels = attackStrategy.getLevels();

                        if (levels != null && !levels.isEmpty()) {
                            isContainerMatching = levels.stream().anyMatch(level -> containerType.equals(level.getContainer().getContainerType()));

                            if (isContainerMatching) {
                                break;
                            }
                        }
                    }

                    return isContainerMatching;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }).collect(Collectors.toSet());

        return this.getAnswersVulnerability(myAnswersByContainer);
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
