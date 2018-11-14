package eu.hermeneut.service.compact;

import eu.hermeneut.domain.compact.RiskProfile;

public interface RiskProfileService {
    RiskProfile getRiskProfile(Long selfAssessmentID);
}
