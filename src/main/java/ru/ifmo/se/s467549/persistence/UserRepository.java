package ru.ifmo.se.s467549.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import ru.ifmo.se.s467549.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}