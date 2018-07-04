package eu.hermeneut.utils.attackstrategy;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.ThreatAgent;

public class AttackStrategyFilter {
    
    public static boolean isAttackPossible(ThreatAgent threatAgent, AttackStrategy attackStrategy) {
        return threatAgent.getSkillLevel().getValue() >= attackStrategy.getSkill().getValue();
    }
}
