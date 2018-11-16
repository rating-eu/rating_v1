package eu.hermeneut.service.impl.compact;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.compact.AttackStrategyRisk;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.compact.AttackStrategyRiskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class AttackStrategyRiskServiceImpl implements AttackStrategyRiskService, MaxValues {

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @Override
    public Set<AttackStrategyRisk> getAttackStrategyRisks(Long selfAssessmentID) throws NotFoundException {
        final Set<AttackStrategyRisk> attackStrategyRisks = new HashSet<>();
        final Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessmentID);

        for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
            final AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();

            final AttackStrategyRisk attackStrategyRisk = new AttackStrategyRisk();
            attackStrategyRisk.setId(augmentedAttackStrategy.getId());
            attackStrategyRisk.setName(augmentedAttackStrategy.getName());
            attackStrategyRisk.setDescription(augmentedAttackStrategy.getDescription());
            attackStrategyRisk.setSkill(augmentedAttackStrategy.getSkill());
            attackStrategyRisk.setFrequency(augmentedAttackStrategy.getFrequency());
            attackStrategyRisk.setResources(augmentedAttackStrategy.getResources());

            float refinedLikelihood = augmentedAttackStrategy.getRefinedLikelihood();
            float contextualLikelihood = augmentedAttackStrategy.getContextualLikelihood();
            float initialLikelihood = augmentedAttackStrategy.getInitialLikelihood();

            if (refinedLikelihood > 0) {
                attackStrategyRisk.setRisk(refinedLikelihood / MAX_LIKELIHOOD);
            } else if (contextualLikelihood > 0) {
                attackStrategyRisk.setRisk(contextualLikelihood / MAX_LIKELIHOOD);
            } else if (initialLikelihood > 0) {
                attackStrategyRisk.setRisk(initialLikelihood / MAX_LIKELIHOOD);
            }

            attackStrategyRisks.add(attackStrategyRisk);
        }

        return attackStrategyRisks;
    }
}
