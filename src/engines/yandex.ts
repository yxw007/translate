import { Engine, BaseEngineOption, EngineTranslateOptions, TranslationError } from "../types";
import { Engines } from "..";
import { throwResponseError } from "@/utils";

export interface YandexEngineOption extends BaseEngineOption {
  key: string;
}

export function yandex(options: YandexEngineOption): Engine {
  const { key } = options;
  const name = "yandex";
  const checkOptions = () => {
    if (!key) {
      throw new TranslationError(name, `${name} key is required`);
    }
  };
  checkOptions();
  const base = "https://translate.yandex.net/api/v1.5/tr.json/translate";

  return {
    name,
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>): Promise<string[]> {
      checkOptions();
      const { from, to } = opts;
      if (!Array.isArray(text)) {
        text = [text];
      }
      const textStr = JSON.stringify(text);
      const url = `${base}?key=${key}&lang=${from}-${to}&text=${encodeURIComponent(textStr)}`;
      const res: any = await fetch(url);
      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }
      const body = await res.json();
      if (!body || body.code !== 200 || !body.text || body.text.length === 0) {
        throw new TranslationError(this.name, "Translate fail ! translate's result is null or empty");
      }
      const translations: string[] = [];
      for (const translation of body.text) {
        if (translation) {
          translations.push(translation);
        }
      }
      return translations;
    },
  };
}
