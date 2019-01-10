package eu.hermeneut.kafka.producer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Profile("kafka")
@Component
public class KafkaProducer<T> {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaProducer.class);

    @Autowired
    private KafkaTemplate<String, T> kafkaObjectTemplate;

    public void send(String topic, T object) {
        kafkaObjectTemplate.send(topic, object);
        LOGGER.info("Message: " + object + " sent to topic: " + topic);
    }
}
