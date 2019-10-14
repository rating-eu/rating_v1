package eu.hermeneut.domain.enumeration;

/**
 * The DataThreatLikelihood enumeration.
 */
public enum DataThreatLikelihood {
    LOW(1), MEDIUM(2), HIGH(3);

    private final int value;

    DataThreatLikelihood(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static DataThreatLikelihood getByValue(int value) {
        switch (value) {
            case 1: {
                return LOW;
            }
            case 2: {
                return MEDIUM;
            }
            case 3: {
                return HIGH;
            }
            default: {
                return null;
            }
        }
    }
}
