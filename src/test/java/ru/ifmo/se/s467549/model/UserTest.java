package ru.ifmo.se.s467549.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testUserDetailsDefaultBehaviors() {
        User user = new User("testUser", "secretPass");

        assertEquals("testUser", user.getUsername());
        assertEquals("secretPass", user.getPassword());

        assertTrue(user.isAccountNonExpired(), "acc expired");
        assertTrue(user.isAccountNonLocked(), "acc locked");
        assertTrue(user.isCredentialsNonExpired(), "creds expired");
        assertTrue(user.isEnabled(), "user disabled");

        assertTrue(user.getAuthorities().isEmpty(), "there are no roles");
    }
}