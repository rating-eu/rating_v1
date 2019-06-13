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

package eu.hermeneut.aop.kafka;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.ImpactMode;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.kafka.service.MessageSenderService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.utils.filter.HasImpactFilter;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Aspect
@Component
@Profile("kafka")
public class KafkaMessagingAspect {
    private final Logger logger = LoggerFactory.getLogger(KafkaMessagingAspect.class);

    @Autowired
    private MessageSenderService messageSenderService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    /**
     * Pointcut for methods annotated with KafkaRiskProfileHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.KafkaRiskProfileHook)")
    public void kafkaRiskProfileHook() {
    }

    /**
     * Cross-cutting method to send the updated RiskProfile to Kafka.
     *
     * @param joinPoint
     */
    @AfterReturning("kafkaRiskProfileHook()")
    public void sendRiskProfileToKafka(JoinPoint joinPoint) {
        logger.debug("SENDING RISK PROFILE AOP...");

        SelfAssessment selfAssessment = null;

        Object[] args = joinPoint.getArgs();

        if (args != null && args.length > 0) {
            if (args[0] instanceof MyAsset) {
                MyAsset myAsset = (MyAsset) args[0];

                if (myAsset.getImpact() != null && myAsset.getImpact() > 0) {
                    selfAssessment = myAsset.getSelfAssessment();
                }
            } else if (args[0] instanceof JoinPoint) {
                JoinPoint updateImpactaJoinPoint = (JoinPoint) args[0];
                Object[] args2 = updateImpactaJoinPoint.getArgs();

                if (args2 != null && args2.length > 0) {
                    //The first parameter must be the ID of the SelfAssessment
                    if (args2[0] instanceof Long) {
                        selfAssessment = this.selfAssessmentService.findOne((Long) args2[0]);
                    }//or the list of the ImpactLevels
                    else if (args2[0] instanceof List) {
                        List<?> list = (List) args[0];

                        if (!list.isEmpty()) {
                            if (list.get(0) instanceof ImpactLevel) {
                                ImpactLevel level = (ImpactLevel) list.get(0);

                                selfAssessment = this.selfAssessmentService.findOne(level.getSelfAssessmentID());
                            }
                        }
                    }
                }
            } else if (args[0] instanceof List) {
                List<?> list = (List) args[0];

                if (list != null && !list.isEmpty()) {
                    if (list.get(0) instanceof MyAsset) {

                        try {
                            List<MyAsset> myAssets = (List<MyAsset>) list;

                            if (myAssets.stream().parallel().allMatch(new HasImpactFilter())) {
                                selfAssessment = myAssets.get(0).getSelfAssessment();
                            }
                        } catch (ClassCastException e) {

                        }
                    }
                }
            }
        }

        if (selfAssessment != null) {
            try {
                this.messageSenderService.sendRiskProfile(selfAssessment.getId());
            } catch (Exception e) {
                logger.warn(e.getMessage());
            }
        }
    }

    /**
     * Pointcut for methods annotated with KafkaVulnerabilityProfileHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.KafkaVulnerabilityProfileHook)")
    public void kafkaVulnerabilityProfileHook() {
    }

    /**
     * Cross-cutting method to send the updated VulnerabilityProfile to Kafka.
     *
     * @param joinPoint
     */
    @AfterReturning("kafkaVulnerabilityProfileHook()")
    public void sendVulnerabilityProfileToKafka(JoinPoint joinPoint) {
        CompanyProfile companyProfile = null;

        Object[] args = joinPoint.getArgs();

        if (args != null) {
            switch (args.length) {
                case 0: {
                    // Do nothing
                    break;
                }
                case 1: {
                    if (args[0] instanceof QuestionnaireStatus) {
                        QuestionnaireStatus questionnaireStatus = (QuestionnaireStatus) args[0];

                        if (questionnaireStatus != null) {
                            companyProfile = questionnaireStatus.getCompanyProfile();
                        }
                    }
                }
            }
        }

        if (companyProfile != null) {
            try {
                this.messageSenderService.sendVulnerabilityProfile(companyProfile.getId());
            } catch (Exception e) {
                logger.warn(e.getMessage());
            }
        }
    }
}
