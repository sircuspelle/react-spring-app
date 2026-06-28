package ru.ifmo.se.s467549;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.datasource.username=sa",
        "spring.datasource.password="
})
class PayrollApplicationTests {

    @Test
    void contextLoads() {
    }
}