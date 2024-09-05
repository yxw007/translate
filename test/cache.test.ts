import { describe, expect, it } from "vitest";
import { Cache } from "../src";
import { delay } from "../src/utils";

describe("cache", () => {
  it.concurrent("base", async () => {
    const cache = new Cache();
    cache.set("key", "value", 1);
    const value = cache.get("key");
    expect(value).toEqual(value);
  });

  it.concurrent("base", async () => {
    const cache = new Cache();
    cache.set("key", "value", 10);

    await delay(5);
    const value = cache.get("key");
    expect(value).toEqual(value);

    await delay(5);
    expect(cache.get("key")).toBeUndefined();
  });
});
