package eu.hermeneut.service.impl;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.dashboard.ImpactEvaluationStatus;
import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.domain.enumeration.CompType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private EBITService ebitService;

    @Autowired
    private EconomicCoefficientsService economicCoefficientsService;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private SplittingLossService splittingLossService;

    @Override
    public ImpactEvaluationStatus getImpactEvaluationStatus(Long selfAssessmentID) throws NullInputException, NotFoundException {
        if (selfAssessmentID == null) {
            throw new NullInputException("SelfAssessmentID CANNOT BE NULL!");
        }

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID " + selfAssessmentID + " NOT FOUND!");
        }

        //Building output
        ImpactEvaluationStatus impactEvaluationStatus = new ImpactEvaluationStatus();

        List<EBIT> ebits = this.ebitService.findAllBySelfAssessment(selfAssessmentID);
        if (ebits == null || ebits.size() != 6) {
            throw new NotFoundException("EBITs for SelfAssessment with ID " + selfAssessmentID + " not found!");
        } else {
            impactEvaluationStatus.setEbits(new HashSet<>(ebits));
        }

        EconomicCoefficients economicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID
            (selfAssessmentID);
        if (economicCoefficients == null) {
            throw new NotFoundException("EconomicCoefficients for SelfAssessment with ID " + selfAssessmentID + " not" +
                " found!");
        } else {
            impactEvaluationStatus.setEconomicCoefficients(economicCoefficients);
        }

        EconomicResults economicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);
        if (economicResults == null) {
            throw new NotFoundException("EconomicResults for SelfAssessment with ID " + selfAssessmentID + " not" +
                " found!");
        } else {
            impactEvaluationStatus.setEconomicResults(economicResults);
        }

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessmentAndAssetType(selfAssessmentID, AssetType.TANGIBLE);

        if (myAssets == null || myAssets.size() == 0) {
            throw new NotFoundException("Tangible MyAssets for SelfAssessment with ID " + selfAssessmentID + " not" +
                " found!");
        } else {
            impactEvaluationStatus.setMyTangibleAssets(new HashSet<>(myAssets));
        }

        CompanyProfile companyProfile = selfAssessment.getCompanyProfile();
        if (companyProfile != null) {
            CompType compType = companyProfile.getType();

            if (compType != null) {
                SectorType sectorType = SectorType.byValue(compType.getValue());

                if (sectorType != null) {
                    impactEvaluationStatus.setSectorType(sectorType);
                }
            }
        }

        /*
        CategoryType is set to null.
         */
        impactEvaluationStatus.setCategoryType(null);

        List<SplittingLoss> splittingLosses = this.splittingLossService.findAllBySelfAssessmentID(selfAssessmentID);
        impactEvaluationStatus.setSplittingLosses(new HashSet<>(splittingLosses));

        return impactEvaluationStatus;
    }
}
