package ru.ifmo.se.s467549;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

import java.time.Duration;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.function.Supplier;
import java.util.stream.Stream;


//https://docs.gatling.io/tutorials/test-as-code/java-jvm/running-your-first-simulation/
public class LabSimulation extends Simulation {

    Iterator<Map<String, Object>> pointFeeder =
            Stream.generate((Supplier<Map<String, Object>>) () -> {
                        Random random = new Random();
                        // 18 signs double
                        double randX = -4.9999 + 10 * random.nextDouble();
                        double randY = -3.0 + 8 * random.nextDouble();
                        double randR = 4.999 * random.nextDouble();
                        return Map.of("randX", randX, "randY", randY, "randR", randR);
                    }
            ).iterator();

    //    https://docs.gatling.io/reference/script/http/protocol/
    HttpProtocolBuilder httpProtocol = http
            .baseUrl("http://localhost:8080")
            .acceptHeader("application/json")
            .contentTypeHeader("application/json");
    //    https://docs.gatling.io/concepts/scenario/#exec
    ScenarioBuilder scenario = scenario("Add Point Scenario")
            .exec(http("Registration")
                    .post("/api/auth/register")
                    .body(StringBody("{ \"username\": \"gatling\", \"password\": \"password\" }"))
                    .check(status().in(200, 400))
            )
            .pause(1)
            .feed(pointFeeder)
            .exec(http("Create Point")
                    .post("/api/results")
                    .basicAuth("gatling", "password")
                    .body(StringBody("{ \"x\": #{randX}, \"y\": #{randY}, \"r\": #{randR} }"))
                    .check(status().is(201))
            );

    //    https://docs.gatling.io/concepts/injection/
    {
        setUp(
                scenario.injectClosed(
                        rampConcurrentUsers(0).to(20).during(60),
                        constantConcurrentUsers(20).during(Duration.ofMinutes(15))
                )
        ).protocols(httpProtocol);
    }
}
