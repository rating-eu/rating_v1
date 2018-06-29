package eu.hermeneut.domain.enumeration;

/**
 * The Frequency enumeration.
 * The Frequency of an @{@link eu.hermeneut.domain.AttackStrategy} is
 * a measure of how often the @{@link eu.hermeneut.domain.AttackStrategy}
 * happens.
 */
public enum Frequency {
    LOW(1), MEDIUM(2), HIGH(3);

    private int value;

    Frequency(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
