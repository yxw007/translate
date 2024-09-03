
import { describe, expect, test } from "vitest";
import { translator, engines } from "../src"

describe("translator", () => {
  test("google translate", async () => {
    translator.use(engines.google());
    const res = await translator.translate("hello", { from: "en", to: "zh", engine: "google" });
    expect(res).toBe("你好");
  });

  test("azure translate", async () => {
    translator.use(engines.azure({
      key: process.env.AZURE_KEY,
      region: process.env.AZURE_REGION
    }));
    const res = await translator.translate("hello", { from: "en", to: "zh", engine: "azure" });
    expect(res).toBe("你好");
  });
});

