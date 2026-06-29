package ru.ifmo.se.s467549.jmx;

import org.springframework.stereotype.Component;

@Component
public class MissPercentage implements MissPercentageMBean {
    private final PointsCounter pointsCounter;

    public MissPercentage(PointsCounter pointsCounter) {
        this.pointsCounter = pointsCounter;
    }

    @Override
    public double getMissPercentage() {
        int total = pointsCounter.getTotalPoints();
        if (total == 0) return 0.0;
        return ((double) pointsCounter.getMissedPoints() / total) * 100.0;
    }
}