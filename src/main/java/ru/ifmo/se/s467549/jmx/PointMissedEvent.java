package ru.ifmo.se.s467549.jmx;

import jdk.jfr.Category;
import jdk.jfr.Event;
import jdk.jfr.Label;
import jdk.jfr.Threshold;

@Category({"User Actions"})
@Label("Point Missed")
@Threshold("0ns")
public class PointMissedEvent extends Event {
    
    @Label("X")
    public double x;

    @Label("Y")
    public double y;
}