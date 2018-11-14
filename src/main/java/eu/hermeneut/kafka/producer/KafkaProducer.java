package eu.hermeneut.kafka.producer;

import eu.hermeneut.domain.compact.RiskProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaProducer {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaProducer.class);

    @Autowired
    @Qualifier("RiskProfile")
    private KafkaTemplate<String, RiskProfile> kafkaObjectTemplate;

    /*public void send(String topic, String payload) {
        kafkaStringTemplate.send(topic, payload);
        LOGGER.info("Message: " + payload + " sent to topic: " + topic);
    }*/

    public void send(String topic, RiskProfile riskProfile) {
        kafkaObjectTemplate.send(topic, riskProfile);
        LOGGER.info("Message: " + riskProfile + " sent to topic: " + topic);
    }
}
