package ru.ifmo.se.s467549.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.FetchType;
import jakarta.persistence.GenerationType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Objects;


/**
 * result of hit model
 * @Entity represents database entity
 * @Table points name of table
 * entity includes database constraints
 */
@Entity
@Table(name = "results")
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(-5) @Max(5)
    private Double x;

    @NotNull
    @Min(-3) @Max(5)
    private Double y;

    @NotNull
    @Min(-5) @Max(5)
    private Double r;

    private boolean isHit;
    private LocalDateTime timestamp;

    // connect entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore // to stop recursive serialization
    private User user;

    public Result() {}

    public Result(Double x, Double y, Double r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }
    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }
    public Double getR() { return r; }
    public void setR(Double r) { this.r = r; }
    public boolean getHit() { return isHit; }
    public void setHit(boolean hit) { isHit = hit; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Result result = (Result) o;
        return getHit() == result.getHit() && Objects.equals(getId(), result.getId()) && Objects.equals(getX(), result.getX()) && Objects.equals(getY(), result.getY()) && Objects.equals(getR(), result.getR()) && Objects.equals(getTimestamp(), result.getTimestamp()) && Objects.equals(getUser(), result.getUser());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getX(), getY(), getR(), getHit(), getTimestamp(), getUser());
    }
}
