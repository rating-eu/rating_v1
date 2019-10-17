package eu.hermeneut.domain.enumeration;

/**
 * The DataImpact enumeration.
 */
public enum DataImpact {
    LOW(1), MEDIUM(2), HIGH(3), VERY_HIGH(4);

    private int value;

    DataImpact(int impact) {
        this.value = impact;
    }

    public int getValue() {
        return value;
    }

    public void setImpact(int impact) {
        this.value = impact;
    }
}
