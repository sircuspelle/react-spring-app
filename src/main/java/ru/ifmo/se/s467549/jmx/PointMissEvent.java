package ru.ifmo.se.s467549.jmx;

import jdk.jfr.Category;
import jdk.jfr.Event;
import jdk.jfr.Label;
import jdk.jfr.Threshold;

@Category({"Lab event", "PointMiss"})
@Label("PointMiss")
@Threshold("0 ms")
public class PointMissEvent extends Event {

}
