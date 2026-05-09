import { afterAll, beforeAll, expect, describe, test } from "bun:test";
import { mongoUrl } from "./setup";
import mongoose from "mongoose";

describe("MongoDB connection", () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUrl);
  }, 10000);

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("stores and reads a value", async () => {
    const TestModel = mongoose.model("Test", new mongoose.Schema({ key: String, value: String }));
    await TestModel.create({ key: "test", value: "test-value" });
    const result = await TestModel.findOne({ key: "test" });
    expect(result?.value).toBe("test-value");
  });
});