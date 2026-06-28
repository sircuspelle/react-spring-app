package ru.ifmo.se.s467549.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AreaCheckServiceTest {

    private final AreaCheckService areaCheckService = new AreaCheckService();

    @Test
    void testHitInFirstQuadrant_Circle() {
        assertTrue(areaCheckService.isHit(1.0, 1.0, 2.0), "(1,1) должна попадать");
        assertFalse(areaCheckService.isHit(2.0, 2.0, 2.0), "(2,2) не должна попадать");
    }

    @Test
    void testHitInSecondQuadrant_Rectangle() {
        assertTrue(areaCheckService.isHit(-1.0, 1.0, 2.0), "(-1,1) должна попадать");
        assertFalse(areaCheckService.isHit(-3.0, 1.0, 2.0), "(-3,1) не должна попадать");
    }

    @Test
    void testHitInThirdQuadrant_Triangle() {
        assertTrue(areaCheckService.isHit(-1.0, -1.0, 3.0), "(-1,-1) должна попадать");
        assertFalse(areaCheckService.isHit(-2.0, -2.0, 2.0), "(-2,-2) не должна попадать");
    }

    @Test
    void testMissInFourthQuadrant() {
        assertFalse(areaCheckService.isHit(1.0, -1.0, 2.0), "(1, -1) не должна попадать");
    }

    @Test
    void testNegativeRadius() {
        assertFalse(areaCheckService.isHit(0.0, 0.0, -1.0), "радиус плохой - промах");
    }
}