FROM maven:3.8-openjdk-8 AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:8-jdk AS runner

RUN groupadd -r newsService && useradd -r -g newsService -d /app newsService

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
COPY --from=builder /app/target/classes /app/classes

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh && chown -R newsService:newsService /app

USER newsService

EXPOSE 8080

CMD ["/app/start.sh"]
