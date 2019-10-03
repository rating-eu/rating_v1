package eu.hermeneut.domain.enumeration;

/**
 * The DataImpact enumeration.
 */
public enum DataImpact {
    LOW(1), MEDIUM(2), HIGH(3), VERY_HIGH(4);

    private int impact;

    DataImpact(int impact) {
        this.impact = impact;
    }

    public int getImpact() {
        return impact;
    }

    public void setImpact(int impact) {
        this.impact = impact;
    }
}
