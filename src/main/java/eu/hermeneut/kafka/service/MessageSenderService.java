package eu.hermeneut.kafka.service;

import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import org.springframework.context.annotation.Profile;

@Profile("kafka")
public interface MessageSenderService {
    void sendRiskProfile(Long selfAssessmentID) throws NullInputException, NotFoundException;
}
