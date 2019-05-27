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

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.kafka.service.MessageSenderService;
import eu.hermeneut.service.SelfAssessmentService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

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
            //The first parameter must be the ID of the SelfAssessment
            if (args[0] instanceof Long) {
                selfAssessment = this.selfAssessmentService.findOne((Long) args[0]);
            } else if (args[0] instanceof MyAsset) {
                MyAsset myAsset = (MyAsset) args[0];

                if (myAsset.getImpact() != null && myAsset.getImpact() > 0) {
                    selfAssessment = myAsset.getSelfAssessment();
                }
            } else if (args[0] instanceof QuestionnaireStatus) {
                QuestionnaireStatus questionnaireStatus = (QuestionnaireStatus) args[0];

                if (questionnaireStatus.getStatus().equals(Status.PENDING) || questionnaireStatus.getStatus().equals(Status.FULL)) {
                    //TODO Fix-Me: CompanyProfile instead of SelfAssessment
                    //selfAssessment = questionnaireStatus.getSelfAssessment();
                }
            }
        }

        //TODO Fix-Me
        if (selfAssessment != null) {
            try {
                this.messageSenderService.sendRiskProfile(selfAssessment.getId());
            } catch (Exception e) {
                logger.warn(e.getMessage());
            }
        }
    }
}
