package eu.hermeneut.service.attackmap;

import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;

import javax.validation.constraints.NotNull;
import java.util.Map;

public interface AugmentedAttackStrategyService {
    Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> getAugmentedAttackStrategyMap(@NotNull Long selfAssessmentID) throws NotFoundException;
}