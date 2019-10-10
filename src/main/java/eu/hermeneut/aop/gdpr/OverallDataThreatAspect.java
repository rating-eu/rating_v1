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
import eu.hermeneut.domain.enumeration.GDPRQuestionnairePurpose;
import eu.hermeneut.service.DataThreatService;
import eu.hermeneut.service.OverallDataThreatService;
import eu.hermeneut.service.gdpr.DataThreatCalculator;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Aspect
@Order(0)
@Component
public class OverallDataThreatAspect {

    @Autowired
    private DataThreatService dataThreatService;

    @Autowired
    private OverallDataThreatService overallDataThreatService;

    @Autowired
    private DataThreatCalculator dataThreatCalculator;

    private Logger logger = LoggerFactory.getLogger(OverallDataThreatAspect.class);

    /**
     * Pointcut for methods annotated with OverallDataThreatHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.gdpr.OverallDataThreatHook)")
    public void overallDataThreatHook() {
    }

    @Transactional
    @AfterReturning(pointcut = "overallDataThreatHook()", returning = "result")
    public void updateOverallDataThreat(JoinPoint joinPoint, Object result) {
        if (result != null && result instanceof GDPRQuestionnaireStatus) {
            GDPRQuestionnaireStatus questionnaireStatus = (GDPRQuestionnaireStatus) result;

            GDPRQuestionnaire questionnaire = questionnaireStatus.getQuestionnaire();

            if (questionnaire != null && questionnaire.getPurpose().equals(GDPRQuestionnairePurpose.THREAT_LIKELIHOOD)) {
                DataOperation operation = questionnaireStatus.getOperation();

                if (operation != null) {
                    List<DataThreat> threats = this.dataThreatService.findAllByDataOperation(operation.getId());
                    OverallDataThreat existingOverall = this.overallDataThreatService.findOneByDataOperation(operation.getId());

                    if (threats != null && !threats.isEmpty()) {
                        OverallDataThreat latestOverall = this.dataThreatCalculator.calculateOverallDataThreat(threats.stream().parallel().collect(Collectors.toSet()));

                        if (existingOverall != null) {
                            existingOverall.setLikelihood(latestOverall.getLikelihood());

                            existingOverall = this.overallDataThreatService.save(existingOverall);

                            for (DataThreat dataThreat : threats) {
                                dataThreat.setOverallDataThreat(existingOverall);
                            }

                            this.dataThreatService.save(threats);
                        } else {
                            latestOverall = this.overallDataThreatService.save(latestOverall);

                            for (DataThreat dataThreat : threats) {
                                dataThreat.setOverallDataThreat(latestOverall);

                                this.dataThreatService.save(dataThreat);
                            }

                            this.dataThreatService.save(threats);
                        }
                    } else {
                        // TODO Should we try to create the DataThreats here?
                        this.logger.warn("DataThreats NOT FOUND...");
                    }
                }
            }
        }
    }
}
