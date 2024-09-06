import { Engine, BaseEngineOption, EngineTranslateOptions } from "../types";

export interface YandexEngineOption extends BaseEngineOption {
  key: string;
}

export function yandex(options: YandexEngineOption): Engine {
  const { key } = options;
  const base = "https://translate.yandex.net/api/v1.5/tr.json/translate";
  return {
    name: "yandex",
    async translate(text: string | string[], opts: EngineTranslateOptions): Promise<string[]> {
      const { from, to } = opts;
      if (!Array.isArray(text)) {
        text = [text];
      }
      const textStr = JSON.stringify(text);
      const url = `${base}?key=${key}&lang=${from}-${to}&text=${encodeURIComponent(textStr)}`;
      const res = await fetch(url);
      const body = await (res as any).json();
      if (!body || body.code !== 200 || !body.text || body.text.length === 0) {
        throw new Error("Translate fail ! translate's result is null or empty");
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
