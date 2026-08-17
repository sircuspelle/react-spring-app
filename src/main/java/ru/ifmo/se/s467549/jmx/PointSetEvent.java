package ru.ifmo.se.s467549.jmx;

import jdk.jfr.Category;
import jdk.jfr.Event;
import jdk.jfr.Label;
import jdk.jfr.Threshold;

@Category({"Lab event", "PointSet"})
@Label("PointSet")
@Threshold("0 ms")
public class PointSetEvent extends Event {
}
