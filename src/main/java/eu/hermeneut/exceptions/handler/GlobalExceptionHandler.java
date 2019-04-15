/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.exceptions.handler;

import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.priority.PriorityOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import javax.annotation.Priority;

@Priority(PriorityOrder.GLOBAL_EXCEPTION_HANDLER)
@ControllerAdvice
public class GlobalExceptionHandler {
    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({NullInputException.class, IllegalInputException.class})
    public ResponseEntity<Object> nullInputHandler(Exception exception, WebRequest request) {
        logger.warn(exception.getClass().getName());
        logger.warn(exception.getMessage());

        return new ResponseEntity<>(
            exception.getMessage(), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({NotFoundException.class})
    public ResponseEntity<Object> notFoundHandler(Exception exception, WebRequest request) {
        logger.warn(exception.getClass().getName());
        logger.warn(exception.getMessage());

        return new ResponseEntity<>(
            exception.getMessage(), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({NotImplementedYetException.class})
    public ResponseEntity<Object> notImplementedYetHandler(Exception exception, WebRequest webRequest) {
        logger.warn(exception.getClass().getName());
        logger.warn(exception.getMessage());

        return new ResponseEntity<>(
            exception.getMessage(), new HttpHeaders(), HttpStatus.NOT_IMPLEMENTED
        );
    }
}
