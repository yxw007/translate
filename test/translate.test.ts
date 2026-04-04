import { describe, expect, it } from "vitest";
import { translator, engines, OpenAIModel, TranslationError, checkLanguages } from "../src";
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs/promises";
import { sleep, splitText } from "../src/utils";
import { languageTexts } from "./constant";
import { expectArrayContain } from "./common";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skippedIntegrationEngines = new Set(
  (process.env.TEST_SKIP_ENGINES ?? "")
    .split(",")
    .map((engine) => engine.trim().toLowerCase())
    .filter(Boolean),
);

function shouldRunIntegrationTest(engine?: string) {
  if (!engine) {
    return true;
  }

  return !skippedIntegrationEngines.has(engine.toLowerCase());
}

function describeIntegration(title: string, fn: () => void, engine?: string) {
  const describeFn = shouldRunIntegrationTest(engine) ? describe : describe.skip;
  describeFn(title, fn);
}

function itConcurrentIntegration(engine: string) {
  return shouldRunIntegrationTest(engine) ? it.concurrent : it.skip;
}

function generateTestCases(checkLanguages: Record<string, string>) {
  return Object.entries(checkLanguages)
    .filter(([_, code]) => languageTexts[code])
    .map(([language, code]) => ({
      text: languageTexts[code],
      expected: code,
      language,
    }));
}

async function runLanguageDetectionTests(engine: string, testCases: ReturnType<typeof generateTestCases>) {
  expect(testCases.length).toBeGreaterThan(0);
  for (const testCase of testCases) {
    const res = await translator.checkLanguage(testCase.text, { engine: engine as keyof typeof checkLanguages });
    await sleep(500);
    expect(res?.toUpperCase()).toBe(testCase.expected.toUpperCase());
  }
}

describeIntegration("translator", () => {
  itConcurrentIntegration("google")("google translate", async () => {
    translator.addEngine(engines.google());

    const res1 = await translator.translate("hello", { from: "en", to: "Chinese", engine: "google" });
    expectArrayContain(res1, ["你好"]);

    const res2 = await translator.translate(["hello", "good"], { to: "zh-CN", engine: "google" });
    expectArrayContain(res2, ["你好", "好"]);

    //use cache
    const start = Date.now();
    const res3 = await translator.translate("hello", { from: "en", to: "Chinese", engine: "google" });
    expect(Date.now() - start).toBeLessThan(2);
    expectArrayContain(res3, ["你好"]);

    const translateText = ["This function adds two  numbers", "@param", "", "— first  number", "@param", "", "— second  number"];
    const res4 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "google" });
    expect(res4.some((it) => it.length <= 0)).toEqual(false);

    const articleFilePath = path.join(__dirname, "./fixtures/article.txt");
    const articleContent = await fs.readFile(articleFilePath, { encoding: "utf-8" });
    const articleTranslated = await translator.translate(articleContent, { from: "en", to: "Chinese", engine: "google" });
    expect(articleTranslated?.length > 0).toBe(true);
    expect(articleTranslated[0].length > 0).toBe(true);

    try {
      await translator.translate(splitText(articleContent, 1000), { from: "en", to: "Chinese", engine: "google" });
    } catch (error: unknown) {
      const translateError = error as TranslationError;
      expect(translateError instanceof TranslationError).toBe(true);
      expect(translateError.message).include(
        "String arrays do not support automatic character splitting, and the total number of characters in a string array exceeds the limit on the number of translated characters.",
      );
    }
  });

  itConcurrentIntegration("azure")("azure translate", async () => {
    translator.addEngine(
      engines.azure({
        key: process.env.AZURE_KEY as string,
        region: process.env.AZURE_REGION as string,
      }),
    );

    const res1 = await translator.translate("hello", { to: "Chinese", engine: "azure" });
    expectArrayContain(res1, ["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh-Hans", engine: "azure" });
    expectArrayContain(res2, ["你好", "好"]);

    const translateText = ["This function adds two  numbers", "@param", "", "— first  number", "@param", "", "— second  number"];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "azure" });
    expect(res3.length).toBe(translateText.length);
  });

  itConcurrentIntegration("amazon")("amazon translate", async () => {
    translator.addEngine(
      engines.amazon({
        region: process.env.AMAZON_REGION as string,
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY as string,
      }),
    );

    const res1 = await translator.translate("hello", { from: "en", to: "zh", engine: "amazon" });
    expectArrayContain(res1, ["你好"]);

    const res11 = await translator.translate("This is a test text, It should be split correctly.", {
      from: "en",
      to: "zh",
      engine: "amazon",
      max_character_num: 10,
    });
    expectArrayContain(res11, ["这是一个 测试 文本，它 应该 分裂正确地。"]);

    const res12 = await translator.translate("What is your name, what can I call you?", { from: "en", to: "zh", engine: "amazon" });
    expectArrayContain(res12, ["你叫什么名字，我能叫你什么？"]);

    const res2 = await translator.translate(["hello", "good"], { to: "zh", engine: "amazon" });
    expectArrayContain(res2, ["你好", "好"]);

    const translateText = ["This function adds two  numbers", "@param", "", "— first  number", "@param", "", "— second  number"];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese (Simplified)", engine: "amazon" });
    expect(res3.length).toBe(translateText.length);
  });

  itConcurrentIntegration("baidu")("baidu translate", async () => {
    translator.addEngine(
      engines.baidu({
        appId: process.env.BAIDU_APP_ID as string,
        secretKey: process.env.BAIDU_SECRET_KEY as string,
      }),
    );

    const res1 = await translator.translate("hello", { to: "zh", engine: "baidu" });
    expectArrayContain(res1, ["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "baidu" });
    expectArrayContain(res2, ["你好", "好"]);

    const translateText = ["This function adds two  numbers", "@param", " ", "— first  number", "@param", " ", "— second  number"];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "baidu" });
    expect(res3.length).toBe(translateText.length);
  });

  itConcurrentIntegration("deepl")("deepl translate", async () => {
    translator.addEngine(
      engines.deepl({
        key: process.env.DEEPL_KEY as string,
      }),
    );

    const res1 = await translator.translate("hello", { to: "Chinese", engine: "deepl" });
    expectArrayContain(res1, ["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "deepl" });
    expectArrayContain(res2, ["你好", "好"]);

    let translateText = ["This function adds two  numbers", "@param", " ", "— first  number", "@param", " ", "— second  number"];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "deepl" });
    expect(res3.length).toBe(translateText.length);

    translateText = ["This function adds two  numbers", "@param", "", "— first  number", "@param", "", "— second  number"];
    try {
      await translator.translate(translateText, { from: "en", to: "Chinese", engine: "deepl" });
    } catch (error) {
      expect((error as Error).message).toEqual("Translate fail ! texts parameter must be a non-empty string or array of non-empty strings");
    }
  });

  itConcurrentIntegration("openai")("openai translate", async () => {
    translator.addEngine(
      engines.openai({
        apiKey: process.env.OPEN_AI_API_KEY as string,
        model: process.env.OPEN_AI_MODEL as OpenAIModel,
      }),
    );

    // Note: Since open ai has different translation results for the same parameters, we only test if the result is returned here.

    const res1 = await translator.translate("hello", { to: "Chinese", engine: "openai" });
    expectArrayContain(res1, ["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "Chinese", engine: "openai" });
    expectArrayContain(res2, ["你好", "好"]);

    const translateText = ["This function adds two  numbers", "@param", " ", "— first  number", "@param", " ", "— second  number"];
    const res3 = await translator.translate(translateText, { from: "en", to: "Chinese", engine: "openai" });
    expect(res3.length).toBe(translateText.length);
  });

  itConcurrentIntegration("tencent")("tencent translate", async () => {
    if (!process.env.TENCENT_SECRET_ID || !process.env.TENCENT_SECRET_KEY) {
      throw new Error(
        "Tencent secretId and secretKey are required. Please set TENCENT_SECRET_ID and TENCENT_SECRET_KEY environment variables.",
      );
    }
    translator.addEngine(
      engines.tencent({
        secretId: process.env.TENCENT_SECRET_ID as string,
        secretKey: process.env.TENCENT_SECRET_KEY as string,
        region: "ap-shenzhen-fsi",
      }),
    );

    const res1 = await translator.translate("hello", { to: "Simplified Chinese", engine: "tencent", from: "auto" });
    expectArrayContain(res1, ["你好"]);

    const res2 = await translator.translate(["hello", "good"], { from: "en", to: "Simplified Chinese", engine: "tencent" });
    expectArrayContain(res2, ["你好", "好"]);

    const translateText = ["This function adds two  numbers", "@param", "", "— first  number", "@param", "", "— second  number"];
    const res3 = await translator.translate(translateText, { from: "en", to: "Simplified Chinese", engine: "tencent" });
    expect(res3.length).toBe(translateText.length);
  });
});

describeIntegration(
  "baidu checkLanguage for common languages",
  () => {
    translator.addEngine(
      engines.baidu({
        appId: process.env.BAIDU_APP_ID as string,
        secretKey: process.env.BAIDU_SECRET_KEY as string,
      }),
    );

    const testCases = generateTestCases(checkLanguages["baidu"]);
    it("should detect all supported languages", { timeout: testCases.length * 2000 }, async () => {
      await runLanguageDetectionTests("baidu", testCases);
    });
  },
  "baidu",
);

describeIntegration(
  "tencent checkLanguage for common languages",
  () => {
    translator.addEngine(
      engines.tencent({
        secretId: process.env.TENCENT_SECRET_ID as string,
        secretKey: process.env.TENCENT_SECRET_KEY as string,
        region: "ap-shenzhen-fsi",
      }),
    );
    const testCases = generateTestCases(checkLanguages["tencent"]);
    it("should detect all supported languages", { timeout: testCases.length * 2000 }, async () => {
      await runLanguageDetectionTests("tencent", testCases);
    });
  },
  "tencent",
);

describeIntegration(
  "azure checkLanguage for common languages",
  () => {
    translator.addEngine(
      engines.azure({
        key: process.env.AZURE_KEY as string,
        region: process.env.AZURE_REGION as string,
      }),
    );

    const testCases = generateTestCases(checkLanguages["azure"]);
    it("should detect all supported languages", { timeout: testCases.length * 2000 }, async () => {
      await runLanguageDetectionTests("azure", testCases);
    });
  },
  "azure",
);

describeIntegration(
  "amazon checkLanguage for common languages",
  () => {
    translator.addEngine(
      engines.amazon({
        region: process.env.AMAZON_REGION as string,
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY as string,
      }),
    );
    const testCases = generateTestCases(checkLanguages["amazon"]);
    it("should detect all supported languages", { timeout: testCases.length * 2000 }, async () => {
      await runLanguageDetectionTests("amazon", testCases);
    });
  },
  "amazon",
);

describeIntegration(
  "deepl checkLanguage for common languages",
  () => {
    translator.addEngine(
      engines.deepl({
        key: process.env.DEEPL_KEY as string,
      }),
    );
    const testCases = generateTestCases(checkLanguages["deepl"]);
    it("should detect all supported languages", { timeout: testCases.length * 2000 }, async () => {
      await runLanguageDetectionTests("deepl", testCases);
    });
  },
  "deepl",
);

describeIntegration(
  "google checkLanguage for common languages",
  () => {
    translator.addEngine(engines.google());
    const testCases = generateTestCases(checkLanguages["google"]);
    it("should detect all supported languages", { timeout: testCases.length * 2000 }, async () => {
      await runLanguageDetectionTests("google", testCases);
    });
  },
  "google",
);
