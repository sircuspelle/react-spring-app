package ru.ifmo.se.s467549.jmx;

import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

@Component
// TODO: Reflection API
// TODO: standard MBean registration
@ManagedResource
public class MissPercentage{
    private double percentage = 0;
    public void setPercentage(int clicks, int misses){
        if (clicks == 0) {
            // its impossible, but safe
            this.percentage = 0;
        }
        else {
            this.percentage = (double) 100 * misses / clicks;
        }
    }
    @ManagedAttribute
    public double getPercentage() {
        return percentage;
    }
}
