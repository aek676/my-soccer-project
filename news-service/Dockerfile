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

RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting orbd..."\n\
orbd -ORBInitialPort 2001 -ORBInitialHost localhost &\n\
echo "Waiting for orbd to be ready..."\n\
while [ ! -d orb.db ]; do sleep 1; done\n\
echo "orbd ready"\n\
java -cp "/app/classes:/app/app.jar:$JAVA_HOME/jre/lib/*" es.ual.news_service.corba.NewsBufferServer -ORBInitialPort 2001 &\n\
sleep 3\n\
echo "Starting Spring Boot app..."\n\
exec java -jar app.jar\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]