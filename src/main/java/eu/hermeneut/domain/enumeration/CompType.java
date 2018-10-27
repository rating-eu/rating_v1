package eu.hermeneut.domain.enumeration;

/**
 * The CompType enumeration.
 */
public enum CompType {
    OTHER(0),
    FINANCE_AND_INSURANCE(1),
    HEALTH_CARE_AND_SOCIAL_ASSISTANCE(2),
    INFORMATION(3),
    PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE(4);

    private final int value;

    CompType(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
