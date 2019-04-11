package eu.hermeneut.kafka.consumer;

import eu.hermeneut.constant.KafkaListenerFactories;
import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.domain.compact.output.CriticalityNotification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Profile("kafka")
@Component
public class KafkaConsumer implements KafkaListenerFactories {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumer.class);

    @KafkaListener(topics = "${kafka.topic.risk-profile}", containerFactory = RISK_PROFILE)
    public void receiveRiskProfile(RiskProfile riskProfile) {
        LOGGER.debug("Message received on RiskProfile: " + riskProfile);
    }

    @KafkaListener(topics = "${kafka.topic.criticality-notification}", containerFactory = CRITICALITY_NOTIFICATION)
    public void receiveCriticalityNotification(CriticalityNotification criticalityNotification) {
        LOGGER.debug("Message received on CriticalityNotification: " + criticalityNotification);

        //TODO persist the criticality notifications
    }
}
