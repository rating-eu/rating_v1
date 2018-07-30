package eu.hermeneut.domain.enumeration;

public enum AnswerLikelihood {
    LOW(5),
    LOW_MEDIUM(4),
    MEDIUM(3),
    MEDIUM_HIGH(2),
    HIGH(1),
	NOT_AVAILABLE(0);

    private final int value;

    AnswerLikelihood(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
