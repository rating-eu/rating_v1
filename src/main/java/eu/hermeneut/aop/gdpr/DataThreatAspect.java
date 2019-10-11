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

import eu.hermeneut.domain.DataOperation;
import eu.hermeneut.domain.DataThreat;
import eu.hermeneut.domain.GDPRQuestionnaire;
import eu.hermeneut.domain.GDPRQuestionnaireStatus;
import eu.hermeneut.domain.enumeration.GDPRQuestionnairePurpose;
import eu.hermeneut.domain.enumeration.ThreatArea;
import eu.hermeneut.service.DataThreatService;
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

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Aspect
@Order(3)
@Component
public class DataThreatAspect {

    @Autowired
    private DataThreatService dataThreatService;

    @Autowired
    private DataThreatCalculator dataThreatCalculator;

    private Logger logger = LoggerFactory.getLogger(DataThreatAspect.class);

    /**
     * Pointcut for methods annotated with DataThreatHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.gdpr.DataThreatHook)")
    public void dataThreatHook() {
    }

    @AfterReturning(pointcut = "dataThreatHook()", returning = "result")
    public void updateDataThreats(JoinPoint joinPoint, Object result) {
        if (result != null && result instanceof GDPRQuestionnaireStatus) {
            GDPRQuestionnaireStatus questionnaireStatus = (GDPRQuestionnaireStatus) result;

            if (questionnaireStatus.getQuestionnaire().getPurpose().equals(GDPRQuestionnairePurpose.THREAT_LIKELIHOOD)) {

                DataOperation operation = questionnaireStatus.getOperation();

                List<DataThreat> existingThreats = this.dataThreatService.findAllByDataOperation(operation.getId());

                // Calculate the DataThreats
                Set<DataThreat> latestThreats = this.dataThreatCalculator.calculateDataThreats(questionnaireStatus);

                Map<ThreatArea, DataThreat> threatsMap = null;

                if (existingThreats != null) {
                    // Map the existing DataThreats if any
                    threatsMap = existingThreats.stream().parallel().collect(Collectors.toMap(
                        dataThreat -> dataThreat.getThreatArea(),
                        Function.identity()
                    ));

                    // Update the Existing Threats or create them from scratch
                    for (DataThreat threat : latestThreats) {
                        if (threatsMap.containsKey(threat.getThreatArea())) {
                            DataThreat existingThreat = threatsMap.get(threat.getThreatArea());

                            existingThreat.setLikelihood(threat.getLikelihood());
                        } else {
                            threatsMap.put(threat.getThreatArea(), threat);
                        }
                    }
                } else {
                    threatsMap = latestThreats.stream().parallel().collect(Collectors.toMap(
                        dataThreat -> dataThreat.getThreatArea(),
                        Function.identity()
                    ));
                }

                if (threatsMap != null && !threatsMap.isEmpty() && threatsMap.size() == ThreatArea.values().length) {
                    threatsMap.values().stream().parallel().forEach((dataThreat) -> {
                        this.dataThreatService.save(dataThreat);
                    });
                }
            }
        }
    }
}
