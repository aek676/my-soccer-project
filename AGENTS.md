# AGENTS.md — my-soccer-project

## Architecture

Spring Cloud microservices monorepo with a Bun/Elysia backend, Ionic Angular frontend, and Playwright E2E tests. Deployed to Azure Container Apps; images stored in GCP Artifact Registry.

```
config-server (:8888) → eureka-server (:8761) → gateway (:8080) → [players, comments, ideal-team, news]
bun-backend → eureka + config-server + MongoDB
ionic-app → Firebase hosting (preview + production)
```

### Service boundaries

| Directory             | Stack                     | DB         | Notes                                                  |
| --------------------- | ------------------------- | ---------- | ------------------------------------------------------ |
| `config-server/`      | Spring Boot 4, Java 17    | —          | Git-backed config server                               |
| `eureka-server/`      | Spring Boot 4, Java 17    | —          | Service registry                                       |
| `gateway/`            | Spring Boot 4, Java 17    | —          | API gateway                                            |
| `players-service/`    | Spring Boot 4, Java 17    | PostgreSQL | JPA + OpenFeign                                        |
| `comments-service/`   | Spring Boot 4, Java 17    | PostgreSQL | JPA + OpenFeign                                        |
| `ideal-team-service/` | Spring Boot 4, Java 17    | PostgreSQL | JPA + OpenFeign                                        |
| `news-service/`       | Spring Boot, **Java 8**   | —          | Different Java version; uses Dockerfile not buildpacks |
| `bun-backend/`        | Elysia + Bun + TypeScript | MongoDB    | Registers with Eureka; reads config from config-server |
| `ionic-app/`          | Angular 20 + Ionic 8      | —          | Firebase hosting; standalone components                |
| `testE2E/`            | Playwright                | —          | Tests ionic-app; Firefox + Mobile Chrome               |
| `terraform/`          | Terraform Cloud           | —          | Infra as code                                          |

## Developer commands

### Java services (all except news-service)

```bash
cd <service>
./mvnw verify              # tests + JaCoCo + checkstyle + spotbugs
./mvnw test                # tests only
./mvnw spring-boot:build-image   # build Docker image via buildpacks
./mvnw clean spring-boot:build-image -T 1C -DskipTests   # parallel, no tests
```

### news-service (Java 8, different build)

```bash
cd news-service
./mvnw test                # tests only
# Docker image built via Dockerfile, not buildpacks
```

### bun-backend

```bash
cd bun-backend
bun run dev                # start dev server with hot reload
bun test                   # runs with testcontainers (MongoDB)
bun run typecheck          # tsc
bun run lint               # biome check --write
bun run build              # compile to binary: dist/server
```

### ionic-app

```bash
cd ionic-app
bun run start              # ng serve (dev server)
bun run build              # build to www/
bun run build -- --configuration production   # prod build
bun run test -- --watch=false --browsers=ChromeHeadless   # CI-style unit tests
bun run lint               # ng lint

# Scaffolding (Ionic CLI — generates standalone components by default)
bunx ionic generate component <name>           # standalone component
bunx ionic generate page <path>                # page with route config
bunx ionic generate service <name>             # injectable service
bunx ionic generate guard <name>               # functional guard
```

### testE2E (Playwright)

```bash
cd testE2E
bun run test               # runs against BASE_URL (default http://localhost:8100)
bun run test:ui            # Playwright UI mode
```

### Full stack (Docker Compose)

```bash
./build-images.sh          # builds all Java service images in parallel (requires mvnw in each)
docker compose up          # starts all services + postgres + mongo + adminer + mongo-express
```

Startup order is enforced by `depends_on`: config-server → eureka-server → gateway → other services.

## CI/CD

- **main.yml** uses `dorny/paths-filter` to run only affected service workflows on PR/push to `main`.
- **Java services** use `tmpl-java-maven-build-push-deploy.yml`: `./mvnw verify` → buildpack image → push to GCP → deploy to Azure.
- **news-service** has its own workflow: `./mvnw test` → Dockerfile build → push → deploy.
- **bun-backend**: `bun ci` → typecheck → biome → build → `bun test` (with testcontainers) → Docker build → deploy.
- **ionic-app**: `bun ci` → ESLint (reviewdog) → Karma headless tests → prod build → Firebase deploy (preview on PR, live on push).
- **Playwright E2E**: runs on PR only, after ionic-app job; fetches Firebase preview URL as `BASE_URL`.
- **Terraform**: plan on PR (paths: `terraform/**`), apply on push to `main`.

## Testing quirks

- **Java services**: `./mvnw verify` runs JaCoCo coverage (80% threshold in CI), Checkstyle (Google rules), and SpotBugs. Reports at `target/surefire-reports/TEST-*.xml`, `target/site/jacoco/jacoco.xml`.
- **bun-backend**: tests use `testcontainers` for MongoDB — requires Docker socket. Preload: `test/setup.ts`. JUnit output at `test/junit.xml`.
- **ionic-app**: Karma + Jasmine. CI requires `--watch=false --browsers=ChromeHeadless`. Coverage output at `coverage/app/lcov.info`.
- **Playwright**: default `BASE_URL` is `http://localhost:8100`. CI fetches Firebase preview URL dynamically.

## Local dev prerequisites

- Java 17 (Java 8 for news-service)
- Bun 1.3.14+
- Docker (for compose + testcontainers)
- Maven wrapper (`./mvnw`) present in each Java service directory
- External config repo: `https://github.com/aek676/spring-my-soccer-project-microservices-config.git` (used by config-server)

## Conventions

- All Java services use Lombok, Spring Cloud Netflix Eureka, Spring Cloud Config, OpenFeign.
- bun-backend uses Biome (not ESLint) for linting/formatting.
- ionic-app uses standalone components (Angular 20), SCSS for styles, ESLint.
- Docker images tagged `latest` and `${{ github.sha }}` in GCP Artifact Registry.
- Azure resource group: `rg-my-soccer-project-eureka`.
