import { describe, expect, it } from "vitest";
import { Translator, Engine, EngineTranslateOptions } from "../src";

function createCustomEngine(): Engine {
  const fromLanguages = {
    Auto: "auto",
    English: "en",
    Chinese: "zh",
  } as const;
  const toLanguages = {
    English: "en",
    Chinese: "zh",
    Japanese: "ja",
  } as const;

  return {
    name: "custom",
    getFromLanguages() {
      return fromLanguages;
    },
    getToLanguages() {
      return toLanguages;
    },
    normalFromLanguage(language?: string) {
      if (!language || language === "auto") {
        return "auto";
      }
      return fromLanguages[language as keyof typeof fromLanguages] ?? "";
    },
    normalToLanguage(language?: string) {
      if (!language) {
        return "";
      }
      return toLanguages[language as keyof typeof toLanguages] ?? "";
    },
    async translate(text: string | string[], options: EngineTranslateOptions) {
      const list = Array.isArray(text) ? text : [text];
      return list.map((item) => `[${options.from}->${options.to}] ${item}`);
    },
  };
}

describe("custom engine", () => {
  it("supports addEngine and engine scoped languages", async () => {
    const translator = new Translator();
    translator.addEngine(createCustomEngine());

    const result = await translator.translate("hello", {
      engine: "custom",
      from: "English",
      to: "Japanese",
    });

    expect(result).toEqual(["[en->ja] hello"]);
    expect(translator.getFromLanguages("custom")).toEqual({
      Auto: "auto",
      English: "en",
      Chinese: "zh",
    });
    expect(translator.getToLanguages("custom")).toEqual({
      English: "en",
      Chinese: "zh",
      Japanese: "ja",
    });
  });
});
