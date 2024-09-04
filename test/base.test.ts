
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

  test("amazon translate", async () => {
    translator.use(engines.amazon({
      region: process.env.AMAZON_REGION,
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY
    }));

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "amazon" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "amazon" });
    expect(res2).toEqual(["你好", "好"]);
  });

  test("baidu translate", async () => {
    translator.use(engines.baidu({
      appId: process.env.BAIDU_APP_ID,
      secretKey: process.env.BAIDU_SECRET_KEY
    }));

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "baidu" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "baidu" });
    expect(res2).toEqual(["你好", "好的"]);
  });
});

