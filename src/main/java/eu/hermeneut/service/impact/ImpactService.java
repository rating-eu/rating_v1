package eu.hermeneut.service.impact;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.List;

public interface ImpactService {
    List<MyAsset> calculateEconomicImpacts(Long selfAssessmentID) throws NotFoundException;

    MyAsset calculateEconomicImpact(Long selfAssessmentID, Long MyAssetID) throws NotFoundException;
}
