import { BaseEngineOption, Engine, EngineTranslateOptions, TranslationError } from "../types";
import { Engines } from "..";
import { throwResponseError } from "@/utils";

export function google(options?: BaseEngineOption): Engine {
  const base = "https://translate.googleapis.com/translate_a/single";
  return {
    name: "google",
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>): Promise<string[]> {
      const { from = "auto", to } = opts;
      if (!Array.isArray(text)) {
        text = [text];
      }
      const textStr = text.join("\n");
      const url = `${base}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(textStr)}`;
      const res: any = await fetch(url);
      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }
      const body = await res.json();
      if (!body || body.length === 0) {
        throw new TranslationError(this.name, "Translate fail ! translate's result is null or empty");
      }
      const translations: string[] = [];
      for (let i = 0; body[0] && i < body[0].length; i++) {
        const item = body[0][i];
        if (!item || item.length == 0 || !Array.isArray(item) || !item[0]) {
          continue;
        }
        translations.push(item[0].replaceAll("\n", ""));
      }
      return translations;
    },
  };
}
