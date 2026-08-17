package ru.ifmo.se.s467549.jmx;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.management.Notification;
import javax.management.NotificationBroadcasterSupport;
import javax.management.openmbean.*;

// TODO: regiatration with JMXConfig
@Component
public class PointsCounter extends NotificationBroadcasterSupport implements PointsCounterMXBean {
    private int pointsCount = 0;
    private int missesCount = 0;
    private int consecutiveMisses = 0;
    private long sequenceNumber = 1;
    private AreaCounter areaCounter = new AreaCounter();
    private MissPercentage missPercentage;

    @Autowired
    public PointsCounter(MissPercentage missPercentage) {
        this.missPercentage = missPercentage;
    }

    public synchronized void clickMade(Double x, Double y, boolean isHit) {
        this.pointsCount += 1;

        if (!isHit) {
            PointMissEvent pointMissEvent = new PointMissEvent();
            pointMissEvent.commit();

            this.missesCount += 1;
            this.consecutiveMisses += 1;

            if (this.consecutiveMisses == 3) {
                Notification n = new Notification("consecutive misses", this, sequenceNumber++, System.currentTimeMillis());

                sendNotification(n);
            }

        } else {
            this.consecutiveMisses = 0;
        }

        missPercentage.setPercentage(pointsCount, missesCount);
        areaCounter.click(x, y);

    }

    public int getPointsCount() {
        return this.pointsCount;
    }

    public int getMissesCount() {
        return this.missesCount;
    }

    public int getConsecutiveMisses() {
        return this.consecutiveMisses;
    }

    public AreaCounter getAreaCount() throws OpenDataException {
//        String[] names = { "First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter" };
//
//        OpenType<?>[] itemTypes = { SimpleType.INTEGER, SimpleType.INTEGER, SimpleType.INTEGER, SimpleType.INTEGER };
//
//        CompositeType type = new CompositeType(
//                "AreaCounter", "Counters by quarters", names, names, itemTypes);
//
//        Object[] values = { areaCounter.getFirstQuarter(), areaCounter.getSecondQuarter(),
//                areaCounter.getThirdQuarter(), areaCounter.getFourthQuarter() };
//
//        return new CompositeDataSupport(type, names, values);
        return areaCounter;
    }

}