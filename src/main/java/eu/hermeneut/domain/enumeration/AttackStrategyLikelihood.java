package eu.hermeneut.domain.enumeration;

/**
 * The AttackStrategyLikelihood enumeration.
 */
public enum AttackStrategyLikelihood {
    LOW(1),
    LOW_MEDIUM(2),
    MEDIUM(3),
    MEDIUM_HIGH(4),
    HIGH(5);

    private final int value;

    AttackStrategyLikelihood(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
