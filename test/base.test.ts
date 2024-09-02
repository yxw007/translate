
import { describe, expect, test } from "vitest";
import { translator, engines } from "../src"

describe("translator", () => {
  test("Translate hello from en to es", async () => {
    translator.use(engines.google());
    const res = await translator.translate("hello", { from: "en", to: "zh", engine: "google" });
    expect(res).toBe("你好");
  });
});

