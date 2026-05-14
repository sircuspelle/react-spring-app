package ru.ifmo.se.s467549.service;

import org.springframework.stereotype.Service;

@Service
public class AreaCheckService {

    public boolean isHit(double x, double y, double r) {
        if (r < 0) return false;

        if (x > 0 && y >= 0) {
            return (x * x + y * y) <= (r * r);
        }

        if (x <= 0 && y >= 0) {
            return (x >= -r) && (y <= r);
        }

        if (x <= 0 && y < 0) {
            return y >= (-x - r);
        }

        return false;
    }
}