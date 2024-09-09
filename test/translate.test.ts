
import { describe, expect, it } from "vitest";
import { translator, engines } from "../src"

describe("translator", () => {
  it.concurrent("google translate", async () => {
    translator.use(engines.google());

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "google" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "google" });
    expect(res2).toEqual(["你好", "好的"]);

    //use cache
    const start = Date.now();
    const res3 = await translator.translate("hello", { from: "en", to: "zh", engine: "google" });
    expect(Date.now() - start).toBeLessThan(1);
    expect(res3).toEqual(["你好"]);
  });

  it.concurrent("azure translate", async () => {
    translator.use(engines.azure({
      key: process.env.AZURE_KEY as string,
      region: process.env.AZURE_REGION as string
    }));

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "azure" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "azure" });
    expect(res2).toEqual(["你好", "好"]);
  });

  it.concurrent("amazon translate", async () => {
    translator.use(engines.amazon({
      region: process.env.AMAZON_REGION as string,
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY as string
    }));

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "amazon" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "amazon" });
    expect(res2).toEqual(["你好", "好"]);
  });

  it.concurrent("baidu translate", async () => {
    translator.use(engines.baidu({
      appId: process.env.BAIDU_APP_ID as string,
      secretKey: process.env.BAIDU_SECRET_KEY as string
    }));

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "baidu" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "baidu" });
    expect(res2).toEqual(["你好", "好的"]);
  });
});

