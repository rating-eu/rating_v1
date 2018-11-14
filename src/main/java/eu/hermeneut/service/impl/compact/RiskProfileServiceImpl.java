package eu.hermeneut.service.impl.compact;

import eu.hermeneut.domain.compact.RiskProfile;
import eu.hermeneut.service.compact.RiskProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RiskProfileServiceImpl implements RiskProfileService {
    @Override
    public RiskProfile getRiskProfile(Long selfAssessmentID) {
        return null;
    }
}
