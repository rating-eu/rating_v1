package eu.hermeneut.service.compact;

import eu.hermeneut.domain.Container;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.utils.tuple.Triad;

import java.util.Map;
import java.util.Set;

public interface AssetRiskService {
    Set<AssetRisk> getAssetRisks(Long selfAssessmentID) throws NotFoundException;

    Triad<Float> getMaxLikelihoodVulnerabilityCriticality(Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap, Map<Long, Container> containers);
}
