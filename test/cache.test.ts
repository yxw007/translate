import { describe, expect, it } from "vitest";
import { Cache } from "../src";
import { delay } from "../src/utils";

describe("cache", () => {
  it.concurrent("should set and get a value", () => {
    const cache = new Cache();
    cache.set("key", "value", 1000);
    const value = cache.get("key");
    expect(value?.value).toBe("value");
  });

  it.concurrent("should delete a value", () => {
    const cache = new Cache();
    cache.set("key", "value", 1000);
    const deleted = cache.delete("key");
    expect(deleted).toBe(true);
    const value = cache.get("key");
    expect(value).toBeUndefined();
  });

  it.concurrent("should not delete a non-existent value", () => {
    const cache = new Cache();
    const deleted = cache.delete("non-existent-key");
    expect(deleted).toBe(false);
  });

  it.concurrent("should clear all values", () => {
    const cache = new Cache();
    cache.set("key1", "value1", 1000);
    cache.set("key2", "value2", 1000);
    cache.clear();
    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBeUndefined();
  });

  it.concurrent("should expire a value after the specified time", async () => {
    const cache = new Cache();
    cache.set("key", "value", 10);
    await delay(15);
    const value = cache.get("key");
    expect(value).toBeUndefined();
  });

  it.concurrent("should reset the timeout if the same key is set again", async () => {
    const cache = new Cache();
    cache.set("key", "value1", 20);
    await delay(10);
    cache.set("key", "value2", 20);
    await delay(15);
    const value = cache.get("key");
    expect(value?.value).toBe("value2");
  });

  it.concurrent("should throw an error if time is less than or equal to 0", () => {
    const cache = new Cache();
    expect(() => cache.set("key", "value", 0)).toThrow("time must be greater than 0");
    expect(() => cache.set("key", "value", -1)).toThrow("time must be greater than 0");
  });
});

