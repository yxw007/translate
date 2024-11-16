
import { describe, expect, it } from "vitest";
import { translator, engines } from "../src"

describe("translator", () => {
  it.concurrent("google translate", async () => {
    translator.use(engines.google());

    const res1 = await translator.translate("hello", { from: "en", to: "Chinese", engine: "google" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { to: "zh-CN", engine: "google" });
    expect(res2).toEqual(["你好", "好的"]);

    //use cache
    const start = Date.now();
    const res3 = await translator.translate("hello", { from: "en", to: "Chinese", engine: "google" });
    expect(Date.now() - start).toBeLessThan(2);
    expect(res3).toEqual(["你好"]);

    const translateText = ['This function adds two  numbers', '@param', '', '— first  number', '@param', '', '— second  number'];
    const res4 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "google" });
    expect(res4).toEqual(["该函数将两个数字相加", "@参数", "— 第一个数字", "@参数", "— 第二个数字"]);
  });

  it.concurrent("azure translate", async () => {
    translator.use(engines.azure({
      key: process.env.AZURE_KEY as string,
      region: process.env.AZURE_REGION as string
    }));

    const res1 = await translator.translate("hello", { to: "Chinese", engine: "azure" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh-Hans", engine: "azure" });
    expect(res2).toEqual(["你好", "好"]);

    const translateText = ['This function adds two  numbers', '@param', '', '— first  number', '@param', '', '— second  number'];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "azure" });
    expect(res3).toEqual(["此函数将两个数字相加", "@param", "", "— 第一个数字", "@param", "", "— 第二个数字"]);
  });

  it.concurrent("amazon translate", async () => {
    translator.use(engines.amazon({
      region: process.env.AMAZON_REGION as string,
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY as string
    }));

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "amazon" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { to: "zh", engine: "amazon" });
    expect(res2).toEqual(["你好", "好"]);

    const translateText = ['This function adds two  numbers', '@param', '', '— first  number', '@param', '', '— second  number'];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese (Simplified)", engine: "amazon" });
    expect(res3).toEqual(["此函数将两个数字相加", "@param", "", "— 第一个数字", "@param", "", "— 第二个数字"]);
  });

  it.concurrent("baidu translate", async () => {
    translator.use(engines.baidu({
      appId: process.env.BAIDU_APP_ID as string,
      secretKey: process.env.BAIDU_SECRET_KEY as string
    }));

    const res1 = await translator.translate("hello", { to: "zh", engine: "baidu" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "baidu" });
    expect(res2).toEqual(["你好", "好的"]);

    const translateText = ['This function adds two  numbers', '@param', ' ', '— first  number', '@param', ' ', '— second  number'];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "baidu" });
    expect(res3).toEqual(["此函数将两个数字相加", "@参数", "-第一个数字", "@参数", "-第二个数字"]);
  });


  it.concurrent("deepl translate", async () => {
    translator.use(engines.deepl({
      key: process.env.DEEPL_KEY as string
    }));

    const res1 = await translator.translate("hello", { to: "Chinese", engine: "deepl" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "deepl" });
    expect(res2).toEqual(["你好", "好"]);

    let translateText = ['This function adds two  numbers', '@param', ' ', '— first  number', '@param', ' ', '— second  number'];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "deepl" });
    expect(res3).toEqual(["此函数将两个数字相加", "@ 参数", "", "- 第一位", "@ 参数", "", "- 二号"]);

    translateText = ['This function adds two  numbers', '@param', '', '— first  number', '@param', '', '— second  number'];
    try {
      await translator.translate(translateText, { from: "en", to: "Chinese", engine: "deepl" });
    } catch (error) {
      expect(error.message).toEqual("Translate fail ! texts parameter must be a non-empty string or array of non-empty strings");
    }
  });
});

