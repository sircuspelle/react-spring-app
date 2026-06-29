FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY . .
RUN ./gradlew labBuild --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
COPY jmxremote.password /app/jmxremote.password
COPY jmxremote.access /app/jmxremote.access
COPY server_keystore.jks /app/server_keystore.jks
RUN chmod 600 /app/jmxremote.password

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]