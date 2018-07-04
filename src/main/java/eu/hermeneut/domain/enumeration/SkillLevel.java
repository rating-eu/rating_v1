package eu.hermeneut.domain.enumeration;

/**
 * The SkillLevel enumeration.
 * The special training or expertise a @{@link eu.hermeneut.domain.ThreatAgent} typically possesses.
 * It represents a mapping between the @{@link eu.hermeneut.domain.ThreatAgent} and the list
 * of {@link eu.hermeneut.domain.AttackStrategy} he is able to perform.
 */
public enum SkillLevel implements Comparable<SkillLevel> {
    HIGH(3), MEDIUM(2), LOW(1);

    private final int value;

    SkillLevel(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
