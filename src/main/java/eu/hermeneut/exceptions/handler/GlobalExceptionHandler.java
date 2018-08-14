package eu.hermeneut.exceptions.handler;

import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({NullInputException.class, IllegalInputException.class})
    public ResponseEntity<Object> nullInputHandler(Exception exception, WebRequest request) {
        return new ResponseEntity<>(
            exception.getMessage(), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({NotFoundException.class})
    public ResponseEntity<Object> notFoundHandler(Exception exception, WebRequest request) {
        return new ResponseEntity<>(
            exception.getMessage(), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }
}
