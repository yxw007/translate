import { EngineTranslateOptions } from "@/types";
import { default as deeplEngine } from "deepl-node";
import { TargetLanguageCode } from "deepl-node";

export interface DeeplEngineOption {
  key: string;
}

export function deepl(options: DeeplEngineOption) {
  const { key } = options;
  const translator = new deeplEngine.Translator(key);
  return {
    name: "deepl",
    async translate(text: string | string[], opts: EngineTranslateOptions) {
      const { to, from = "auto" } = opts;
      if (!Array.isArray(text)) {
        text = [text];
      }

      const translations: string[] = [];
      const res = await translator.translateText(text, null, to as TargetLanguageCode);
      for (const item of res) {
        translations.push(item.text);
      }
      return translations;
    },
  };
}
