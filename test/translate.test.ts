
import { describe, expect, it } from "vitest";
import { translator, engines, OpenAIModel, TranslationError } from "../src"
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs/promises"
import { splitText } from "../src/utils";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("translator", () => {
  it.concurrent("google translate", async () => {
    translator.addEngine(engines.google());

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
    expect(res4.some(it => it.length <= 0)).toEqual(false);

    const articleFilePath = path.join(__dirname, "./fixtures/article.txt");
    const articleContent = await fs.readFile(articleFilePath, { encoding: "utf-8" });
    const articleTranslated = await translator.translate(articleContent, { from: "en", to: "Chinese", engine: "google" });
    expect(articleTranslated?.length > 0).toBe(true);
    expect(articleTranslated[0].length > 0).toBe(true);

    try {
      await translator.translate(splitText(articleContent, 1000), { from: "en", to: "Chinese", engine: "google" });
    } catch (error: any) {
      const translateError = error as TranslationError;
      expect(translateError instanceof TranslationError).toBe(true);
      expect(translateError.message).include("String arrays do not support automatic character splitting, and the total number of characters in a string array exceeds the limit on the number of translated characters.");
    }
  });

  it.concurrent("azure translate", async () => {
    translator.addEngine(engines.azure({
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
    translator.addEngine(engines.amazon({
      region: process.env.AMAZON_REGION as string,
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY as string
    }));

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "amazon" });
    expect(res1).toEqual(["你好"]);

    const res11 = await translator.translate("This is a test text, It should be split correctly.", { from: "en", to: "zh", engine: "amazon", max_character_num: 10 });
    expect(res11).toEqual(["这是一个 测试 文本，它 应该 分裂正确地。"]);

    const res12 = await translator.translate("What is your name, what can I call you?", { from: "en", to: "zh", engine: "amazon" });
    expect(res12).toEqual(["你叫什么名字，我能叫你什么？"]);

    const res2 = await translator.translate(["hello", "good"], { to: "zh", engine: "amazon" });
    expect(res2).toEqual(["你好", "好"]);

    const translateText = ['This function adds two  numbers', '@param', '', '— first  number', '@param', '', '— second  number'];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese (Simplified)", engine: "amazon" });
    expect(res3).toEqual(["此函数将两个数字相加", "@param", "", "— 第一个数字", "@param", "", "— 第二个数字"]);
  });

  it.concurrent("baidu translate", async () => {
    translator.addEngine(engines.baidu({
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
    translator.addEngine(engines.deepl({
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

  it.concurrent("openai translate", async () => {
    translator.addEngine(engines.openai({
      apiKey: process.env.OPEN_AI_API_KEY as string,
      model: process.env.OPEN_AI_MODEL as OpenAIModel
    }));

    // Note: Since open ai has different translation results for the same parameters, we only test if the result is returned here.

    const res1 = await translator.translate("hello", { to: "Chinese", engine: "openai" });
    expect(res1).toEqual(["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "Chinese", engine: "openai" });
    expect(res2).toEqual(["你好", "好"]);

    const translateText = ['This function adds two  numbers', '@param', ' ', '— first  number', '@param', ' ', '— second  number'];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "openai" });
    expect(res3).toEqual(['这个函数添加两个数字', '@param', '— 第一个数字', '@param', '— 第二个数字']);
  });
});

