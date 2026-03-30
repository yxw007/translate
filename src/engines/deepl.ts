import { CheckLanguageError, EngineTranslateOptions, TranslationError } from "../types";
import { throwResponseError } from "@/utils";
import deeplLanguages from "../language/engines/deepl";
import { normalizeEngineLanguage } from "./helper";

export interface DeeplEngineOption {
  key: string;
  fromLanguages?: typeof deeplLanguages.from;
  toLanguages?: typeof deeplLanguages.to;
}

interface Translation {
  text: string;
  detected_source_language: string;
}

export function deepl(options: DeeplEngineOption) {
  const { key, fromLanguages = deeplLanguages.from, toLanguages = deeplLanguages.to } = options;
  const name = "deepl";
  const checkOptions = () => {
    if (!key) {
      throw new TranslationError(name, `${name} key is required`);
    }
  };
  checkOptions();
  const url = "https://api-free.deepl.com/v2/translate";

  return {
    name,
    getFromLanguages() {
      return fromLanguages;
    },
    getToLanguages() {
      return toLanguages;
    },
    normalFromLanguage(language?: string) {
      return normalizeEngineLanguage(language, fromLanguages, true);
    },
    normalToLanguage(language?: string) {
      return normalizeEngineLanguage(language, toLanguages);
    },
    async translate(text: string | string[], opts: EngineTranslateOptions) {
      checkOptions();
      const { to, from } = opts;
      if (!Array.isArray(text)) {
        text = [text];
      }
      const res: any = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `DeepL-Auth-Key ${key}`,
          Accept: "*/*",
          Host: "api-free.deepl.com",
          Connection: "keep-alive",
        },
        body: JSON.stringify({
          text: text,
          source_lang: from === "auto" ? undefined : from,
          target_lang: to,
        }),
      });
      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }
      const bodyRes = await (res as any).json();
      if (bodyRes.error) {
        throw new TranslationError(this.name, `Translate fail ! code: ${bodyRes.error.code}, message: ${bodyRes.error.message}`);
      }
      const body: Translation[] = bodyRes.translations;
      if (!body || body.length === 0) {
        throw new TranslationError(this.name, "Translate fail ! translate's result is null or empty");
      }
      const translations: string[] = body.map((t) => t.text);
      return translations;
    },
    async checkLanguage(text: string): Promise<string> {
      checkOptions();

      const res: any = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `DeepL-Auth-Key ${key}`,
          Accept: "*/*",
          Host: "api-free.deepl.com",
          Connection: "keep-alive",
        },
        body: JSON.stringify({
          text: [text],
          target_lang: "EN",
        }),
      });

      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }

      const bodyRes = await res.json();
      if (bodyRes.error) {
        throw new CheckLanguageError(this.name, `Check language fail ! code: ${bodyRes.error.code}, message: ${bodyRes.error.message}`);
      }

      const body: Translation[] = bodyRes.translations;
      if (!body || body.length === 0) {
        throw new CheckLanguageError(this.name, "Check language fail! No result returned");
      }

      const detectedLanguage = body[0].detected_source_language;
      if (!detectedLanguage) {
        throw new CheckLanguageError(this.name, "Check language fail! Language not detected");
      }

      return detectedLanguage;
    },
  };
}
