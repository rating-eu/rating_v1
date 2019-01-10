package eu.hermeneut.service;

import eu.hermeneut.domain.wp4.ThreatAgentInterest;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.List;

public interface ThreatAgentInterestService {
    List<ThreatAgentInterest> getThreatAgentInterestsByMyAsset(Long selfAssessmentID, Long myAssetID) throws NotFoundException;
}
