package ru.ifmo.se.s467549.jmx;

import java.beans.ConstructorProperties;

public class AreaStatistics {
    private int hitsFirstQuadrant;
    private int hitsSecondQuadrant;
    private int hitsThirdQuadrant;
    private int hitsFourthQuadrant;

    @ConstructorProperties({"hitsFirstQuadrant", "hitsSecondQuadrant", "hitsThirdQuadrant", "hitsFourthQuadrant"})
    public AreaStatistics(int q1, int q2, int q3, int q4) {
        this.hitsFirstQuadrant = q1;
        this.hitsSecondQuadrant = q2;
        this.hitsThirdQuadrant = q3;
        this.hitsFourthQuadrant = q4;
    }

    public int getHitsFirstQuadrant() { return hitsFirstQuadrant; }
    public int getHitsSecondQuadrant() { return hitsSecondQuadrant; }
    public int getHitsThirdQuadrant() { return hitsThirdQuadrant; }
    public int getHitsFourthQuadrant() { return hitsFourthQuadrant; }
}
