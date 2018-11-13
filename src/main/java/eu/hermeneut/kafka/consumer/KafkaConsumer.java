package eu.hermeneut.kafka.consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumer.class);

    @KafkaListener(topics = "topic1")
    public void receiveTopic1(ConsumerRecord<?, ?> consumerRecord) {
        LOGGER.info("Message received on topic1: " + consumerRecord.toString());
    }

    @KafkaListener(topics = "topic2")
    public void receiveTopic2(ConsumerRecord<?, ?> consumerRecord) {
        LOGGER.info("Message received on topic2: " + consumerRecord.toString());
    }
}
