package eu.hermeneut.kafka.consumer;

import eu.hermeneut.domain.compact.RiskProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumer.class);

    @KafkaListener(topics = "risk-profile")
    public void receiveRiskProfile(RiskProfile riskProfile) {
        LOGGER.info("Message received on RiskProfile: " + riskProfile);
    }
}
