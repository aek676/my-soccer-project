import { GenericContainer, StartedTestContainer } from "testcontainers";
import { afterAll, beforeAll } from "bun:test";
import { Wait } from "testcontainers";

let mongoContainer: StartedTestContainer;
export let mongoUrl: string;

beforeAll(async () => {
  mongoContainer = await new GenericContainer("mongo:4.4.18")
    .withExposedPorts(27017)
    .withWaitStrategy(Wait.forLogMessage("Waiting for connections"))
    .start();
  const port = mongoContainer.getMappedPort(27017);
  const ip = mongoContainer.getHost();
  mongoUrl = `mongodb://${ip}:${port}`;
}, 60000);

afterAll(async () => {
  await mongoContainer?.stop();
});
