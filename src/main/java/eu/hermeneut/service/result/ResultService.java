package eu.hermeneut.service.result;

import eu.hermeneut.domain.result.Result;

import java.util.Map;

public interface ResultService {
    Result getThreatAgentsResult(Long selfAssessmentID);

    Float getOverallLikelihood(Long selfAssessmentID);

    /**
     * Returns a MAP where the key is the ID of the Threat-Agent
     * and the value is its Level of Interest.
     *
     * @param selfAssessmentID the DI of the SelfAssessment
     * @return the MAP of the levels of interest of the threat-agents
     */
    Map<Long, Float> getLevelsOfInterest(Long selfAssessmentID);
}
