package eu.hermeneut.service.impl.compact;

import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.domain.compact.AttackStrategyRisk;
import eu.hermeneut.domain.compact.RiskProfile;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.compact.AssetRiskService;
import eu.hermeneut.service.compact.AttackStrategyRiskService;
import eu.hermeneut.service.compact.RiskProfileService;
import eu.hermeneut.service.result.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.Set;

@Service
@Transactional
public class RiskProfileServiceImpl implements RiskProfileService {
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private AttackStrategyRiskService attackStrategyRiskService;

    @Autowired
    private AssetRiskService assetRiskService;

    @Override
    public RiskProfile getRiskProfile(@NotNull Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID = " + selfAssessmentID + " could NOT be FOUND.");
        }

        //Output
        RiskProfile riskProfile = new RiskProfile();

        riskProfile.setSelfAssessmentID(selfAssessmentID);

        CompanyProfile companyProfile = selfAssessment.getCompanyProfile();

        if (companyProfile != null) {
            riskProfile.setCompanyID(companyProfile.getId());
            riskProfile.setCompanyName(companyProfile.getName());
        }

        //OK
        Float overallLikelihood = this.resultService.getOverallLikelihood(selfAssessmentID);
        riskProfile.setOverallLikelihood(overallLikelihood);

        //OK
        Set<AssetRisk> assetRisks = this.assetRiskService.getAssetRisks(selfAssessmentID);
        riskProfile.setAssetRisks(assetRisks);

        //OK
        final Set<AttackStrategyRisk> attackStrategyRisks = this.attackStrategyRiskService.getAttackStrategyRisks(selfAssessmentID);
        riskProfile.setAttackStrategyRisks(attackStrategyRisks);

        Result result = this.resultService.getResult(selfAssessmentID);
        riskProfile.setVulnerabilities(result);

        return riskProfile;
    }
}
