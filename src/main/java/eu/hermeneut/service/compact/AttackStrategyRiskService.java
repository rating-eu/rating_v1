package eu.hermeneut.service.compact;

import eu.hermeneut.domain.compact.AttackStrategyRisk;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.Set;

public interface AttackStrategyRiskService {
    Set<AttackStrategyRisk> getAttackStrategyRisks(Long selfAssessmentID) throws NotFoundException;
}
