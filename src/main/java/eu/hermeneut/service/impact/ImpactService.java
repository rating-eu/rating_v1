package eu.hermeneut.service.impact;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.formula.ImpactFormulator;

import java.util.List;

public interface ImpactService extends ImpactFormulator {
    List<MyAsset> calculateEconomicImpacts(Long selfAssessmentID) throws NotFoundException;

    MyAsset calculateEconomicImpact(Long selfAssessmentID, Long MyAssetID) throws NotFoundException;
}
