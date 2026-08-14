package ru.ifmo.se.s467549.jmx;

public class AreaCounter {
    private int firstQuarter;
    private int secondQuarter;
    private int thirdQuarter;
    private int fourthQuarter;

    public AreaCounter() {
        firstQuarter = 0;
        secondQuarter = 0;
        thirdQuarter = 0;
        fourthQuarter = 0;    
    }

    public void click(Double x, Double y) {
        if (x >= 0) {
            if (y >= 0) {
                firstQuarter += 1;
            }
            else {
                fourthQuarter += 1;
            }
        }
        else {
            if (y >= 0) {
                secondQuarter += 1;
            }
            else {
                thirdQuarter += 1;
            } 
        }
    }

    public int getFirstQuarter() {
        return firstQuarter;
    }

    public int getSecondQuarter() {
        return secondQuarter;
    }

    public int getThirdQuarter() {
        return thirdQuarter;
    }

    public int getFourthQuarter() {
        return fourthQuarter;
    }
}