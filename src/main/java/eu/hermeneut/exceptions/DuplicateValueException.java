package eu.hermeneut.exceptions;

public class DuplicateValueException extends Exception {
    public DuplicateValueException() {
        this("Duplicate Value exception!!!");
    }

    public DuplicateValueException(String message) {
        super(message);
    }
}
