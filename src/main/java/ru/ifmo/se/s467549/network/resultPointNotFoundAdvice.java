package ru.ifmo.se.s467549.network;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// rendered straight into the response body
@RestControllerAdvice
class resultPointNotFoundAdvice {

    @ExceptionHandler(resultPointNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String resultPointNotFoundHandler(resultPointNotFoundException ex) {
        return ex.getMessage();
    }
}