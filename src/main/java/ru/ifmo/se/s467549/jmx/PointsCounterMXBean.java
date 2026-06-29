
package ru.ifmo.se.s467549.jmx;

public interface PointsCounterMXBean {
    int getTotalPoints();
    int getMissedPoints();
    int getConsecutiveMisses();
    AreaStatistics getAreaStats();
}