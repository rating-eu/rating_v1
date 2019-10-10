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
import eu.hermeneut.service.OverallDataRiskService;
import eu.hermeneut.service.OverallDataThreatService;
import eu.hermeneut.service.OverallSecurityImpactService;
import eu.hermeneut.service.gdpr.DataRiskCalculator;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Aspect
@Order(0)
@Component
public class OverallDataRiskAspect {

    @Autowired
    private OverallSecurityImpactService overallSecurityImpactService;

    @Autowired
    private OverallDataThreatService overallDataThreatService;

    @Autowired
    private OverallDataRiskService overallDataRiskService;

    @Autowired
    private DataRiskCalculator dataRiskCalculator;

    /**
     * Pointcut for methods annotated with OverallDataThreatHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.gdpr.OverallDataRiskHook)")
    public void overallDataRiskHook() {
    }

    @Transactional
    @AfterReturning(pointcut = "overallDataRiskHook()", returning = "result")
    public void updateOverallDataThreat(JoinPoint joinPoint, Object result) {
        if (result != null && result instanceof GDPRQuestionnaireStatus) {
            GDPRQuestionnaireStatus questionnaireStatus = (GDPRQuestionnaireStatus) result;

            GDPRQuestionnaire questionnaire = questionnaireStatus.getQuestionnaire();

            if (questionnaire != null && questionnaire.getPurpose().equals(GDPRQuestionnairePurpose.THREAT_LIKELIHOOD)) {
                DataOperation operation = questionnaireStatus.getOperation();

                if (operation != null) {
                    OverallSecurityImpact overallSecurityImpact = this.overallSecurityImpactService.findOneByDataOperation(operation.getId());
                    OverallDataThreat overallDataThreat = this.overallDataThreatService.findOneByDataOperation(operation.getId());

                    if (overallSecurityImpact != null && overallDataThreat != null) {
                        OverallDataRisk existingOverallDataRisk = this.overallDataRiskService.findOneByDataOperation(operation.getId());

                        OverallDataRisk actualOverallDataRisk = this.dataRiskCalculator.calculateOverallDataRisk(overallSecurityImpact, overallDataThreat);

                        if (existingOverallDataRisk != null) {
                            existingOverallDataRisk.setRiskLevel(actualOverallDataRisk.getRiskLevel());
                            this.overallDataRiskService.save(existingOverallDataRisk);
                        } else {
                            this.overallDataRiskService.save(actualOverallDataRisk);
                        }
                    }
                }
            }
        }
    }
}
