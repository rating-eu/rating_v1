package eu.hermeneut.service.compact;

import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.Set;

public interface AssetRiskService {
    Set<AssetRisk> getAssetRisks(Long selfAssessmentID) throws NotFoundException;
}
