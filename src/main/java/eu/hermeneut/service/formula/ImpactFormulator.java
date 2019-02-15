package eu.hermeneut.service.formula;

import eu.hermeneut.exceptions.NotFoundException;

public interface ImpactFormulator {
    String formulateImpact(Long selfAssessmentID, Long myAssetID) throws NotFoundException;
}
