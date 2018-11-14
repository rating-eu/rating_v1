package eu.hermeneut.service.impl.compact;

import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.service.compact.AssetRiskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class AssetRiskServiceImpl implements AssetRiskService {
    @Override
    public Set<AssetRisk> getAssetRisks(Long selfAssessmentID) {
        return null;
    }
}
