package eu.hermeneut.domain.enumeration;

/**
 * The ResourceLevel enumeration.
 */
public enum ResourceLevel {
    LOW(1), MEDIUM(2), HIGH(3);

    private int value;

    ResourceLevel(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
