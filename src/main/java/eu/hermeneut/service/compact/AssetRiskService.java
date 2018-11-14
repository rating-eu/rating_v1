package eu.hermeneut.service.compact;

import eu.hermeneut.domain.compact.AssetRisk;

import java.util.Set;

public interface AssetRiskService {
    Set<AssetRisk> getAssetRisks(Long selfAssessmentID);
}
