package eu.hermeneut.service.impl.compact;

import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.domain.compact.AttackStrategyRisk;
import eu.hermeneut.domain.compact.RiskProfile;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.compact.RiskProfileService;
import eu.hermeneut.service.result.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
@Transactional
public class RiskProfileServiceImpl implements RiskProfileService {
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private ResultService resultService;

    @Override
    public RiskProfile getRiskProfile(@NotNull Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID = " + selfAssessmentID + " could NOT be FOUND.");
        }

        //Output
        RiskProfile riskProfile = new RiskProfile();

        riskProfile.setSelfAssessmentID(selfAssessmentID);

        Random random = new Random();

        //TODO calculate it
        riskProfile.setOverallLikelihood(random.nextFloat());

        Set<AssetRisk> assetRisks = new HashSet<>();
        //TODO calculate it
        riskProfile.setAssetRisks(assetRisks);

        Set<AttackStrategyRisk> attackStrategyRisks = new HashSet<>();
        //TODO calculate it
        riskProfile.setAttackStrategyRisks(attackStrategyRisks);

        Result result = this.resultService.getResult(selfAssessmentID);
        riskProfile.setVulnerabilities(result);

        return riskProfile;
    }
}
