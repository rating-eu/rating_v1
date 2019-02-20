package eu.hermeneut.service.wp4;

import eu.hermeneut.domain.Mitigation;
import eu.hermeneut.domain.wp4.MyAssetRisk;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.List;

public interface MyAssetRiskService {
    List<MyAssetRisk> getMyAssetRisksBySelfAssessment(Long selfAssessmentID) throws NotFoundException;

    List<Mitigation> getMyAssetMitigations(Long selfAssessmentID, Long myAssetID) throws NotFoundException;
}
