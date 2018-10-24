package eu.hermeneut.domain.enumeration;

/**
 * The SectorType enumeration.
 */
public enum SectorType {
    GLOBAL(0),
    FINANCE_AND_INSURANCE(1),
    HEALTH_CARE_AND_SOCIAL_ASSISTANCE(2),
    INFORMATION(3),
    PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE(4);

    private final int value;

    SectorType(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }

    public static SectorType byValue(int value) {
        switch (value) {
            case 0:
                return GLOBAL;
            case 1:
                return FINANCE_AND_INSURANCE;
            case 2:
                return HEALTH_CARE_AND_SOCIAL_ASSISTANCE;
            case 3:
                return INFORMATION;
            case 4:
                return PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE;
            default:
                return null;
        }
    }
}
