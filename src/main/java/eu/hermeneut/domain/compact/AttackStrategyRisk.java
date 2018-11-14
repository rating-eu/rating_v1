package eu.hermeneut.domain.compact;

import eu.hermeneut.domain.AttackStrategy;

public class AttackStrategyRisk {
    private AttackStrategy attackStrategy;
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

    public AttackStrategyRisk(AttackStrategy attackStrategy, Float risk) {
        this.attackStrategy = attackStrategy;
        this.risk = risk;
    }

    public AttackStrategy getAttackStrategy() {
        return attackStrategy;
    }

    public void setAttackStrategy(AttackStrategy attackStrategy) {
        this.attackStrategy = attackStrategy;
    }

    public Float getRisk() {
        return risk;
    }

    public void setRisk(Float risk) {
        this.risk = risk;
    }
}
