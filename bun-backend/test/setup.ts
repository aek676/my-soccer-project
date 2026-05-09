import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from "@testcontainers/mongodb";
import { afterAll, beforeAll } from "bun:test";
import { Wait } from "testcontainers";

let mongoContainer: StartedMongoDBContainer;
export let mongoUrl: string;

beforeAll(async () => {
  mongoContainer = await new MongoDBContainer("mongo:4.4-focal")
    .withExposedPorts(27017)
    .withWaitStrategy(Wait.forListeningPorts())
    .start();
  mongoUrl = mongoContainer.getConnectionString();
});

afterAll(async () => {
  mongoContainer?.stop();
});
