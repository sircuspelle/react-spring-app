package ru.ifmo.se.s467549;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

//https://docs.gatling.io/tutorials/test-as-code/java-jvm/running-your-first-simulation/
public class WebLabLoadSimulation extends Simulation {

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
            .exec(http("Create Point")
                .post("/api/results")
                .basicAuth("gatling", "password")
                .body(StringBody("{ \"x\": 1.0, \"y\": 1.0, \"r\": 2.0 }"))
                .check(status().is(201))
            );

//    https://docs.gatling.io/concepts/injection/
    {
       setUp(
            scenario.injectOpen(
                rampUsersPerSec(1).to(50).during(10),
                constantUsersPerSec(50).during(60)
            )
        ).protocols(httpProtocol);
    }
}
