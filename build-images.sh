#!/bin/bash

PROJECTS=(
  "config-server:0.0.1-SNAPSHOT"
  "eureka-server:0.0.1-SNAPSHOT"
  "gateway:0.0.1-SNAPSHOT"
  "comments-service:0.0.1-SNAPSHOT"
  "players-service:0.0.1-SNAPSHOT"
  "ideal-team-service:0.0.1-SNAPSHOT"
)

echo "=== Building Docker Images (Parallel) ==="

for PROJECT in "${PROJECTS[@]}"; do
  NAME="${PROJECT%%:*}"
  VERSION="${PROJECT##*:}"

  (
    echo "Building $NAME..."
    cd "$NAME"
    ./mvnw clean spring-boot:build-image -T 1C -DskipTests -Dspring-boot.build-image.imageName="$NAME:$VERSION"
    echo "✅ $NAME built successfully"
  ) &
done

wait

echo "=== All images built ==="