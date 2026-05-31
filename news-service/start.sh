#!/bin/bash
set -e
trap 'kill $(jobs -p) 2>/dev/null' EXIT
echo "Starting orbd..."
orbd -ORBInitialPort 2001 -ORBInitialHost 0.0.0.0 &
echo "Waiting for orbd to be ready..."
while [ ! -d orb.db ]; do sleep 1; done
echo "orbd ready"
java -cp "/app/classes:/app/app.jar:$JAVA_HOME/jre/lib/*" es.ual.news_service.corba.NewsBufferServer -ORBInitialPort 2001 -ORBInitialHost 0.0.0.0 &
sleep 3
echo "Starting Spring Boot app..."
exec java -jar app.jar
