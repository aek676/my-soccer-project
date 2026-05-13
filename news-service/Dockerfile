FROM maven:3.8-openjdk-8 AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:8-jdk

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
COPY --from=builder /app/target/classes /app/classes

EXPOSE 8084

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]