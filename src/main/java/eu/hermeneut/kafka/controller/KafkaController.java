package eu.hermeneut.kafka.controller;

import eu.hermeneut.domain.compact.RiskProfile;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.kafka.producer.KafkaProducer;
import eu.hermeneut.service.compact.RiskProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaController {
    @Autowired
    private KafkaProducer<RiskProfile> kafkaProducer;

    @Autowired
    private RiskProfileService riskProfileService;

    @PostMapping("/kafka/{topicName}/{selfAssessmentID}")
    public void sendRiskProfile(@PathVariable String topicName, @PathVariable Long selfAssessmentID) {
        try {
            RiskProfile riskProfile = this.riskProfileService.getRiskProfile(selfAssessmentID);

            if (riskProfile != null) {
                kafkaProducer.send(topicName, riskProfile);
            }
        } catch (NotFoundException e) {
            e.printStackTrace();
        }
    }
}
