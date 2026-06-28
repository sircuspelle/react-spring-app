package ru.ifmo.se.s467549.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ifmo.se.s467549.model.Result;
import ru.ifmo.se.s467549.model.User;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Page<Result> findByUser(User user, Pageable pageable);

    List<Result> findByUser(User user);
}
