package eu.hermeneut.service.impl.compact;

import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.compact.AssetRisk;
import eu.hermeneut.domain.compact.AttackStrategyRisk;
import eu.hermeneut.domain.compact.RiskProfile;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.compact.AssetRiskService;
import eu.hermeneut.service.compact.AttackStrategyRiskService;
import eu.hermeneut.service.compact.RiskProfileService;
import eu.hermeneut.service.result.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Map;
import java.util.Random;
import java.util.Set;

@Service
@Transactional
public class RiskProfileServiceImpl implements RiskProfileService {
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

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

        //OK
        Float overallLikelihood = this.resultService.getOverallLikelihood(selfAssessmentID);
        riskProfile.setOverallLikelihood(overallLikelihood);

        Set<AssetRisk> assetRisks = new HashSet<>();
        //TODO calculate it
        riskProfile.setAssetRisks(assetRisks);

        //OK
        final Set<AttackStrategyRisk> attackStrategyRisks = new HashSet<>();
        final Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessmentID);

        for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
            final AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();

            final AttackStrategyRisk attackStrategyRisk = new AttackStrategyRisk();
            attackStrategyRisk.setAttackStrategy(augmentedAttackStrategy);

            float refinedLikelihood = augmentedAttackStrategy.getRefinedLikelihood();
            float contextualLikelihood = augmentedAttackStrategy.getContextualLikelihood();
            float initialLikelihood = augmentedAttackStrategy.getInitialLikelihood();

            if (refinedLikelihood > 0) {
                attackStrategyRisk.setRisk(refinedLikelihood);
            } else if (contextualLikelihood > 0) {
                attackStrategyRisk.setRisk(contextualLikelihood);
            } else if (initialLikelihood > 0) {
                attackStrategyRisk.setRisk(initialLikelihood);
            }

            attackStrategyRisks.add(attackStrategyRisk);
        }

        riskProfile.setAttackStrategyRisks(attackStrategyRisks);

        Result result = this.resultService.getResult(selfAssessmentID);
        riskProfile.setVulnerabilities(result);

        return riskProfile;
    }
}
