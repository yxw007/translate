import { EngineTranslateOptions, TranslationError } from "@/types";
import { Engines } from "..";
import { throwResponseError } from "@/utils";

export interface DeeplEngineOption {
  key: string;
}

interface Translation {
  text: string;
  detected_source_language: string;
}

export function deepl(options: DeeplEngineOption) {
  const { key } = options;
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
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) {
      checkOptions();
      const { to, from } = opts;
      if (!Array.isArray(text)) {
        text = [text];
      }
      const requestBody = JSON.stringify({
        text,
        source_lang: from === "auto" ? undefined : from,
        target_lang: to,
      });
      const res: any = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8;",
          Authorization: `DeepL-Auth-Key ${key}`,
          Connection: "keep-alive",
        },
        body: requestBody,
      });
      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }
      const bodyRes = await res.json();
      const body: Translation[] = bodyRes?.translations;
      if (!body || body.length === 0) {
        throw new TranslationError(this.name, "Translate fail ! translate's result is null or empty");
      }
      const translations: string[] = body.map((t) => t.text);
      return translations;
    },
  };
}
