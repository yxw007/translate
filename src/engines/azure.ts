/**
 * Azure translate documentation: https://learn.microsoft.com/zh-cn/azure/ai-services/translator/reference/v3-0-translate
 */

import { Engine, EngineTranslateOptions, BaseEngineOption, TranslationError, CheckLanguageError } from "../types";
import { Engines } from "..";
import { throwResponseError } from "@/utils";

interface Translation {
  translations: Array<{ text: string; to: string; from: string }>;
}

export interface AzureEngineOption extends BaseEngineOption {
  key: string;
  region: string;
}

export function azure(options: AzureEngineOption): Engine {
  const { key, region } = options;
  const name = "azure";
  const checkOptions = () => {
    if (!key || !region) {
      throw new TranslationError(name, `${name} key and region is required`);
    }
  };
  checkOptions();
  const base = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

  return {
    name,
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>): Promise<string[]> {
      checkOptions();
      const { from, to } = opts;
      const url = `${base}&to=${to}${from && from !== "auto" ? `&from=${from}` : ""}`;
      if (!Array.isArray(text)) {
        text = [text];
      }
      const res: any = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": region,
        },
        body: JSON.stringify(text.map((it) => ({ Text: it }))),
      });
      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }
      const bodyRes = await (res as any).json();
      if (bodyRes.error) {
        throw new TranslationError(
          this.name,
          `Translate fail ! code: ${bodyRes.error.code}, message: ${bodyRes.error.message} \n Go to https://learn.microsoft.com/zh-cn/azure/ai-services/translator/text-translation/reference/v3/translate view details`
        );
      }
      const body: Translation[] = bodyRes;
      if (!body || body.length === 0) {
        throw new TranslationError(this.name, "Translate fail ! translate's result is null or empty");
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
    async checkLanguage<T extends Engines>(text: string): Promise<string> {
      checkOptions();
      const url = `${base}&to=en`;
      const res: any = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": region,
        },
        body: JSON.stringify([{ Text: text }]),
      });

      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }

      const bodyRes = await (res as any).json();
      if (bodyRes.error) {
        throw new CheckLanguageError(
          this.name,
          `checkLanguage fail ! code: ${bodyRes.error.code}, message: ${bodyRes.error.message} \n Go to https://learn.microsoft.com/zh-cn/azure/ai-services/translator/text-translation/reference/v3/translate view details`
        );
      }
      if (!bodyRes || !Array.isArray(bodyRes) || bodyRes.length === 0) {
        throw new CheckLanguageError(this.name, "Check language fail! No result returned");
      }

      const detectedLanguage = bodyRes[0]?.detectedLanguage?.language;
      if (!detectedLanguage) {
        throw new CheckLanguageError(this.name, "Check language fail! Language not detected");
      }

      return detectedLanguage;
    },
  };
}
