package eu.hermeneut.service.impl.compact;

import eu.hermeneut.domain.compact.AttackStrategyRisk;
import eu.hermeneut.service.compact.AttackStrategyRiskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class AttackStrategyRiskServiceImpl implements AttackStrategyRiskService {
    @Override
    public Set<AttackStrategyRisk> getAttackStrategyRisks(Long selfAssessmentID) {
        return null;
    }
}
