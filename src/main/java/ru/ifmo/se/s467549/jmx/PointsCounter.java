package ru.ifmo.se.s467549.jmx;

import org.springframework.stereotype.Component;
import javax.management.Notification;
import javax.management.NotificationBroadcasterSupport;

@Component
public class PointsCounter extends NotificationBroadcasterSupport implements PointsCounterMXBean {
    private int totalPoints = 0;
    private int missedPoints = 0;
    private int consecutiveMisses = 0;
    private long sequenceNumber = 1;

    private int q1 = 0, q2 = 0, q3 = 0, q4 = 0;

    public synchronized void addPoint(double x, double y, boolean isHit) {
        totalPoints++;
        
        if (isHit) {
            consecutiveMisses = 0;
            if (x >= 0 && y >= 0) q1++;
            else if (x < 0 && y >= 0) q2++;
            else if (x < 0 && y < 0) q3++;
            else q4++;
        } else {
            missedPoints++;
            consecutiveMisses++;
            
            if (consecutiveMisses >= 3) {
                Notification n = new Notification(
                    "ru.ifmo.se.s467549.misses", 
                    this, 
                    sequenceNumber++, 
                    System.currentTimeMillis(), 
                    "missed 3 or more times in a row"
                );
                sendNotification(n);
                consecutiveMisses = 0;
            }
        }
    }

    @Override
    public int getTotalPoints() { return totalPoints; }

    @Override
    public int getMissedPoints() { return missedPoints; }

    @Override
    public int getConsecutiveMisses() { return consecutiveMisses; }

    @Override
    public AreaStatistics getAreaStats() { return new AreaStatistics(q1, q2, q3, q4); }
}