package eu.hermeneut.kafka.service;

import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;

public interface MessageSenderService {
    void sendRiskProfile(Long selfAssessmentID) throws NullInputException, NotFoundException;
}
