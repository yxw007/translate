
import { describe, expect, test } from "vitest";
import { translator, engines } from "../src"

describe("translator", () => {
  test("google translate", async () => {
    translator.use(engines.google());

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "google" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "google" });
    expect(res2).toEqual(["你好", "好的"]);
  });

  test("azure translate", async () => {
    translator.use(engines.azure({
      key: process.env.AZURE_KEY,
      region: process.env.AZURE_REGION
    }));

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "azure" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "azure" });
    expect(res2).toEqual(["你好", "好"]);
  });
});

