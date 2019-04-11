package eu.hermeneut.service.compact;

import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.exceptions.NotFoundException;

public interface RiskProfileService {
    RiskProfile getRiskProfile(Long selfAssessmentID) throws NotFoundException;
}
