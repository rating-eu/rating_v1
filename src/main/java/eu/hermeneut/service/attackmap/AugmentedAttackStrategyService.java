package eu.hermeneut.service.attackmap;

import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;

import javax.validation.constraints.NotNull;
import java.util.Map;

public interface AugmentedAttackStrategyService {
    /**
     * Returns the MAP of Augmented AttackStrategies with their likelihoods and vulnerabilities.
     * The key is the ID of the AttackStrategy, while the value is the Augmented AttackStrategy.
     *
     * @param selfAssessmentID The id of the SelfAssessment for which we want to calculate the Augmented AttackStrategies.
     * @return The MAP of Augmented AttackStrategies with their likelihoods and vulnerabilities.
     * @throws NotFoundException
     */
    Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> getAugmentedAttackStrategyMap(@NotNull Long selfAssessmentID) throws NotFoundException;
}
