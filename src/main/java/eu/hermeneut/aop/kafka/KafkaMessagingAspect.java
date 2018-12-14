package eu.hermeneut.aop.kafka;

import eu.hermeneut.kafka.service.MessageSenderService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class KafkaMessagingAspect {
    private final Logger logger = LoggerFactory.getLogger(KafkaMessagingAspect.class);

    @Autowired
    private MessageSenderService messageSenderService;

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

        System.out.println("SENDING RISK PROFILE WORKS...");
        System.out.println("JoinPoint: " + joinPoint.getSignature());
        System.out.println("MessageService: " + this.messageSenderService);
    }
}
