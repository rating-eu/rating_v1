package eu.hermeneut.domain.compact;

import eu.hermeneut.domain.AttackStrategy;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

public class AttackStrategyRisk {
    private AttackStrategy attackStrategy;
    /**
     * Initial, Refined or Contextual likelihood associated to the AttackStrategy.
     * The rightmost is preferred if available.
     * This field represents a percentage value,
     * hence it assumes values between 0 and 1.
     */
    @Min(0)
    @Max(1)
    private Float risk;

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
