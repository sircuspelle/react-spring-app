package ru.ifmo.se.s467549.jmx;

import javax.management.MXBean;
import javax.management.openmbean.CompositeData;
import javax.management.openmbean.OpenDataException;

/*
By default, an interface is an MXBean interface if it is public and its name ends with MXBean
*/
@MXBean
public interface PointsCounterMXBean {
    int getPointsCount();
    int getMissesCount();
    
    CompositeData getAreaCount() throws OpenDataException;
}
