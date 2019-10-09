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

package eu.hermeneut.aop.gdpr;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.service.GDPRQuestionService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Aspect
@Order(2)
@Component
public class QuestionnaireStatusCompletionAspect {

    @Autowired
    private GDPRQuestionService questionService;

    /**
     * Pointcut for methods annotated with QuestionnaireStatusCompletionHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.gdpr.QuestionnaireStatusCompletionHook)")
    public void questionnaireStatusCompletionHook() {
    }

    @Before(value = "questionnaireStatusCompletionHook()")
    public void updateQuestionnaireStatusCompletion(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();

        if (args != null && args.length == 1) {
            Object arg0 = args[0];

            Status status = Status.EMPTY;

            if (arg0 != null && arg0 instanceof GDPRQuestionnaireStatus) {
                GDPRQuestionnaireStatus questionnaireStatus = (GDPRQuestionnaireStatus) arg0;

                GDPRQuestionnaire questionnaire = questionnaireStatus.getQuestionnaire();

                List<GDPRQuestion> questions = this.questionService.findAllByQuestionnaire(questionnaire.getId());
                Set<GDPRMyAnswer> myAnswers = questionnaireStatus.getAnswers();


                if (myAnswers != null && !myAnswers.isEmpty()) {
                    // Count the MyAnswers with answer != null
                    long validAnswers = myAnswers.stream().parallel()
                        .filter(myAnswer -> myAnswer.getAnswer() != null)
                        .count();

                    if (questions != null && !questions.isEmpty()) {
                        if (validAnswers == questions.size()) {
                            status = Status.FULL;
                        } else if (validAnswers < questions.size()) {
                            status = Status.PENDING;
                        } else {
                            status = Status.EMPTY;
                        }
                    }
                } else {
                    status = Status.EMPTY;
                }

                questionnaireStatus.setStatus(status);
            }
        }
    }
}
