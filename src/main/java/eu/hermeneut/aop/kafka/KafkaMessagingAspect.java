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
                    selfAssessment = questionnaireStatus.getSelfAssessment();
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
}
