package ru.ifmo.se.s467549.jmx;

import jdk.jfr.Category;
import jdk.jfr.Event;
import jdk.jfr.Label;
import jdk.jfr.Threshold;

@Category({"User Actions"})
@Label("Point Set")
@Threshold("0ns")
public class PointSetEvent extends Event {
    
    @Label("X")
    public double x;

    @Label("Y")
    public double y;

    @Label("R")
    public double r;

    @Label("IsHit")
    public boolean isHit;
}