package ru.ifmo.se.s467549.network;


/**
 * custom 404 not found error
 */
public class resultPointNotFoundException extends RuntimeException {

    public resultPointNotFoundException(Long id) {
        super("Couldn't find result " + id);
    }
}
