package eu.hermeneut.kafka.service.impl;

import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.compact.RiskProfile;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.kafka.config.KafkaTopic;
import eu.hermeneut.kafka.producer.KafkaProducer;
import eu.hermeneut.kafka.service.MessageSenderService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.compact.RiskProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MessageSenderServiceImpl implements MessageSenderService {

    @Autowired
    private RiskProfileService riskProfileService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private KafkaTopic kafkaTopic;

    @Autowired
    private KafkaProducer<RiskProfile> kafkaProducer;

    @Override
    public void sendRiskProfile(Long selfAssessmentID) throws NullInputException, NotFoundException {
        if (selfAssessmentID == null) {
            throw new NullInputException("SelfAssessmentID CANNOT BE NULL!");
        }

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with id: " + selfAssessmentID + " NOT FOUND!");
        }

        RiskProfile riskProfile = this.riskProfileService.getRiskProfile(selfAssessmentID);

        this.kafkaProducer.send(this.kafkaTopic.getRiskProfile(), riskProfile);
    }
}
