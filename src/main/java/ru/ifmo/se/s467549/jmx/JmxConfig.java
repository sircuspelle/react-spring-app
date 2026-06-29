package ru.ifmo.se.s467549.jmx;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import javax.management.monitor.GaugeMonitor;
import java.lang.management.ManagementFactory;

@Configuration
public class JmxConfig {

    private final PointsCounter pointsCounter;
    private final MissPercentage missPercentage;

    public JmxConfig(PointsCounter pointsCounter, MissPercentage missPercentage) {
        this.pointsCounter = pointsCounter;
        this.missPercentage = missPercentage;
    }

    @PostConstruct
    public void initJmx() {
        try {
            MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();

            ObjectName counterName = new ObjectName("ru.ifmo.se.s467549:type=PointsCounter");
            mbs.registerMBean(pointsCounter, counterName);

            ObjectName percentageName = new ObjectName("ru.ifmo.se.s467549:type=MissPercentage");
            mbs.registerMBean(missPercentage, percentageName);

            GaugeMonitor monitor = new GaugeMonitor();
            ObjectName monitorName = new ObjectName("ru.ifmo.se.s467549:type=GaugeMonitor");
            mbs.registerMBean(monitor, monitorName);

            monitor.addObservedObject(counterName);
            monitor.setObservedAttribute("ConsecutiveMisses");
            monitor.setNotifyHigh(true);
            monitor.setNotifyLow(false);
            monitor.setThresholds(3, 0); 
            monitor.setGranularityPeriod(1000);

            monitor.start();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}