package eu.hermeneut.domain.enumeration;

/**
 * The QuestionType enumeration.
 */
public enum QuestionType {
    REGULAR(1), RELEVANT(2), OTHER(3);

    private int value;

    QuestionType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
