FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.gradle ./gradlew labBuild --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
COPY --from=builder /app/application.properties application.properties
COPY --from=builder /app/jmxremote.password jmxremote.password
COPY --from=builder /app/jmxserverkeystore jmxserverkeystore
RUN chmod 600 jmxremote.password
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]