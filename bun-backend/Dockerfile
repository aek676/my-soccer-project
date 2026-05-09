FROM oven/bun:1.3.13 AS build

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src
COPY tsconfig.json tsconfig.json

ENV NODE_ENV=production

RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --outfile server \
  src/index.ts

FROM gcr.io/distroless/base-debian13:nonroot AS runner

WORKDIR /app

COPY --from=build /app/server server
# COPY --from=build /app/src/public ./src/public

ENV NODE_ENV=production

EXPOSE 8080

CMD ["./server"]

