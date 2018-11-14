package eu.hermeneut.service.result;

import eu.hermeneut.domain.result.Result;

public interface ResultService {
    Result getResult(Long selfAssessmentID);

    Float getOverallLikelihood(Long selfAssessmentID);
}
