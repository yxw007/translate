import { EngineTranslateOptions } from "@/types";
import { default as deeplEngine, SourceLanguageCode } from "deepl-node";
import { TargetLanguageCode } from "deepl-node";
import { Engines } from "..";

export interface DeeplEngineOption {
  key: string;
}

export function deepl(options: DeeplEngineOption) {
  const { key } = options;
  const translator = new deeplEngine.Translator(key);
  return {
    name: "deepl",
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) {
      const { to, from = "auto" } = opts;
      if (!Array.isArray(text)) {
        text = [text];
      }

      const translations: string[] = [];
      const res = await translator.translateText(text, (from === "auto" ? null : from) as SourceLanguageCode, to as TargetLanguageCode);
      for (const item of res) {
        translations.push(item.text);
      }
      return translations;
    },
  };
}
