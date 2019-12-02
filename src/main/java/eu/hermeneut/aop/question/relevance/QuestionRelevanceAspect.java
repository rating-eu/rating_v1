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

package eu.hermeneut.aop.question.relevance;

import eu.hermeneut.domain.Answer;
import eu.hermeneut.domain.MyAnswer;
import eu.hermeneut.domain.QuestionRelevance;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.enumeration.AnswerLikelihood;
import eu.hermeneut.service.QuestionRelevanceService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Aspect
@Component
public class QuestionRelevanceAspect {

    @Autowired
    private QuestionRelevanceService questionRelevanceService;

    /**
     * Pointcut for methods annotated with KafkaVulnerabilityProfileHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.UpdateQuestionRelevancesHook)")
    public void updateQuestionRelevancesHook() {
    }

    /**
     * Cross-cutting method to send the updated VulnerabilityProfile to Kafka.
     *
     * @param joinPoint
     */
    @AfterReturning("updateQuestionRelevancesHook()")
    public void updateQuestionRelevances(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();

        if (args != null) {
            if (args.length == 1) {
                if (args[0] instanceof QuestionnaireStatus) {
                    QuestionnaireStatus questionnaireStatus = (QuestionnaireStatus) args[0];

                    if (questionnaireStatus != null) {
                        Set<MyAnswer> myAnswers = questionnaireStatus.getAnswers();

                        if (myAnswers != null && !myAnswers.isEmpty()) {
                            List<QuestionRelevance> relevances = this.questionRelevanceService.findAllByQuestionnaireStatus(questionnaireStatus.getId());

                            if (relevances != null && !relevances.isEmpty()) {
                                Map<Long/*QuestionID*/, MyAnswer> myAnswersMap = myAnswers.stream()
                                    .parallel()
                                    .collect(Collectors.toMap(myAnswer -> myAnswer.getQuestion().getId(), Function.identity()));

                                relevances.stream().parallel().forEach((questionRelevance) -> {
                                    long questionID = questionRelevance.getQuestion().getId();

                                    if (myAnswersMap.containsKey(questionID)) {
                                        Answer answer = myAnswersMap.get(questionID).getAnswer();
                                        AnswerLikelihood likelihood = answer.getLikelihood();

                                        // Update the relevance value
                                        questionRelevance.setRelevance(likelihood.getValue());
                                    }
                                });

                                this.questionRelevanceService.save(relevances);
                            }
                        }
                    }
                }
            }
        }
    }
}
