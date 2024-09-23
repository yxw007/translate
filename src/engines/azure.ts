/**
 * Azure translate documentation: https://learn.microsoft.com/zh-cn/azure/ai-services/translator/reference/v3-0-translate
 */

import { Engine, EngineTranslateOptions, BaseEngineOption } from "../types";
import { Engines } from "..";

interface Translation {
  translations: Array<{ text: string; to: string; from: string }>;
}

export interface AzureEngineOption extends BaseEngineOption {
  key: string;
  region: string;
}

export function azure(options: AzureEngineOption): Engine {
  const { key, region } = options;
  const base = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
  return {
    name: "azure",
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>): Promise<string[]> {
      const { from, to } = opts;
      const url = `${base}&to=${to}${from && from !== "auto" ? `&from=${from}` : ""}`;
      if (!Array.isArray(text)) {
        text = [text];
      }
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": region,
        },
        body: JSON.stringify(text.map((it) => ({ Text: it }))),
      });
      const bodyRes = await (res as any).json();
      if (bodyRes.error) {
        throw new Error(`Translate fail ! code: ${bodyRes.error.code}, message: ${bodyRes.error.message}`);
      }
      const body: Translation[] = bodyRes;
      if (!body || body.length === 0) {
        throw new Error("Translate fail ! translate's result is null or empty");
      }
      const translations: string[] = [];
      for (const translation of body) {
        if (!translation.translations || translation.translations.length == 0) {
          continue;
        }
        translations.push(...translation.translations.map((t) => t.text));
      }
      return translations;
    },
  };
}
