package eu.hermeneut.service.attacks;

import eu.hermeneut.domain.attacks.CriticalAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.List;

public interface CriticalAttackStrategyService {
    List<CriticalAttackStrategy> getCriticalAttackStrategies(Long selfAssessmentID) throws NotFoundException;
}
