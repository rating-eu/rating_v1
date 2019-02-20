package eu.hermeneut.service.compact;

import eu.hermeneut.domain.Container;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.Map;
import java.util.Set;

public interface AssetRiskService {
    Set<AssetRisk> getAssetRisks(Long selfAssessmentID) throws NotFoundException;

    float getCritical(Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap, Set<Container> containers);
}
