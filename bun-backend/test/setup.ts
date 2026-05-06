import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from "@testcontainers/mongodb";

let mongoContainer: StartedMongoDBContainer;

export async function setup(project) {
  mongoContainer = await new MongoDBContainer("mongo:4.4-focal").start();
  project.provide("mongoUrl", mongoContainer.getConnectionString());
}

export async function teardown() {
  await mongoContainer.stop();
}
