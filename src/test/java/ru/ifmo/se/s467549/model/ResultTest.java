package ru.ifmo.se.s467549.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ResultTest {

    @Test
    void testResultConstructorSetsTimestamp() {
        Result result = new Result(1.0, -2.0, 3.0);

        assertEquals(1.0, result.getX());
        assertEquals(-2.0, result.getY());
        assertEquals(3.0, result.getR());

        assertNotNull(result.getTimestamp(), "timestamp must be automatically set");

        assertFalse(result.getHit(), "by default isHit = false");
    }
}