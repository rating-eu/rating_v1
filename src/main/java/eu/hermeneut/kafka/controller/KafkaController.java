package eu.hermeneut.kafka.controller;

import eu.hermeneut.kafka.producer.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaController {
    @Autowired
    KafkaProducer kafkaProducer;

    @PostMapping("/kafka/{topicName}")
    public void sendToTopic(@PathVariable String topicName, @RequestBody String message) {
        kafkaProducer.send(topicName, message);
    }
}
