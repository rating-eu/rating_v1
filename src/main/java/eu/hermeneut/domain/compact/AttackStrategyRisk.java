package eu.hermeneut.domain.compact;

import eu.hermeneut.constant.MaxValues;
import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;

public class AttackStrategyRisk implements MaxValues {
    private AugmentedAttackStrategy attackStrategy;
    /**
     * Initial, Refined or Contextual likelihood associated to the AttackStrategy.
     * The rightmost is preferred if available.
     * This field represents a percentage value,
     * hence it assumes values between 0 and 1.
     */
    private Float risk;

    public AttackStrategyRisk() {
        this.attackStrategy = null;
        this.risk = null;
    }

    public AttackStrategyRisk(AugmentedAttackStrategy attackStrategy, Float risk) {
        this.attackStrategy = attackStrategy;
        this.risk = risk;
    }

    public AttackStrategy getAttackStrategy() {
        return attackStrategy;
    }

    public void setAttackStrategy(AugmentedAttackStrategy attackStrategy) {
        this.attackStrategy = attackStrategy;
    }

    public Float getRisk() {
        return risk;
    }

    public void setRisk(Float risk) {
        if (risk < 0 || risk > 1) {
            throw new IllegalArgumentException("Risk must be normalized to a value between 0 and 1");
        }
        this.risk = risk;
    }
}
