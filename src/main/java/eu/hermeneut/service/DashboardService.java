package eu.hermeneut.service;

import eu.hermeneut.domain.dashboard.ImpactEvaluationStatus;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;

public interface DashboardService {
    ImpactEvaluationStatus getImpactEvaluationStatus(Long selfAssessmentID) throws NullInputException, NotFoundException;
}
