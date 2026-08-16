package ru.ifmo.se.s467549.jmx;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.management.*;
import javax.management.monitor.CounterMonitor;
import javax.management.monitor.GaugeMonitor;
import java.lang.management.ManagementFactory;

@Configuration
public class JMXConfig {
    @PostConstruct
    public GaugeMonitor getMissesGaugeMonitor() throws MalformedObjectNameException, NotCompliantMBeanException, InstanceAlreadyExistsException, MBeanRegistrationException {
        GaugeMonitor gaugeMonitor = new GaugeMonitor();
        ObjectName monitorObject = ObjectName.getInstance("ru.ifmo.se.s467549.jmx:name=pointsCounter,type=PointsCounter");
        gaugeMonitor.addObservedObject(monitorObject);
        gaugeMonitor.setObservedAttribute("ConsecutiveMisses");
        gaugeMonitor.setGranularityPeriod(100);
        gaugeMonitor.setNotifyLow(false);
        gaugeMonitor.setNotifyHigh(true);
        gaugeMonitor.setThresholds(3, 0);

        MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();

        ObjectName name = new ObjectName("ru.ifmo.se.s467549.jmx:name=gaugeMissesMonitor,type=GaugeMonitor");

        if (!mbs.isRegistered(name)) {
            mbs.registerMBean(gaugeMonitor, name);
        }

        gaugeMonitor.start();

        return gaugeMonitor;
    }
    @PostConstruct
    public CounterMonitor getMissesCounterMonitor() throws MalformedObjectNameException, NotCompliantMBeanException, InstanceAlreadyExistsException, MBeanRegistrationException {
        CounterMonitor counterMonitor = new CounterMonitor();
        ObjectName monitorObject = ObjectName.getInstance("ru.ifmo.se.s467549.jmx:name=pointsCounter,type=PointsCounter");

        counterMonitor.addObservedObject(monitorObject);
        counterMonitor.setObservedAttribute("ConsecutiveMisses");
        counterMonitor.setGranularityPeriod(100);
        counterMonitor.setInitThreshold(3);
        counterMonitor.setNotify(true);

        MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();

        ObjectName name = new ObjectName("ru.ifmo.se.s467549.jmx:name=counterMissesMonitor,type=CounterMonitor");

        if (!mbs.isRegistered(name)) {
            mbs.registerMBean(counterMonitor, name);
        }

        counterMonitor.start();

        return counterMonitor;
    }
}
