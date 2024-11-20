import { Engine, EngineTranslateOptions, BaseEngineOption, TranslationError, OpenAIModel, OPEN_AI_MODELS } from "../types";
import { Engines } from "..";

export interface OpenAIEngineOption extends BaseEngineOption {
  apiKey: string;
  model: OpenAIModel;
}

export function openai(options: OpenAIEngineOption): Engine {
  const { apiKey, model } = options;

  const name = "openai";
  const checkOptions = () => {
    if (!apiKey) {
      throw new TranslationError(name, `${name} apiKey is required`);
    }
    if (!OPEN_AI_MODELS.includes(model)) {
      throw new TranslationError(name, `${name} model=${model} is invalid`);
    }
  };
  checkOptions();
  const base = "https://api.openai.com/v1/chat/completions";

  return {
    name,
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>): Promise<string[]> {
      checkOptions();
      const { from, to } = opts;
      const url = `${base}`;
      if (!Array.isArray(text)) {
        text = [text];
      }

      const prompt = `Translate the following text from ${from} to ${to}: ${text.join(" ")}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a translator" },
            { role: "user", content: prompt }
          ],
          max_tokens: 1000,
        })
      });
      const bodyRes = await (res as any).json();
      if (bodyRes.error) {
        throw new TranslationError(this.name, `Translate fail! message: ${bodyRes.error.message}`);
      }
      if (!bodyRes || !bodyRes.choice || bodyRes.choice.length === 0) {
        throw new TranslationError(this.name, "Translate fail ! translate's result is null or empty");
      }
      const translations: string[] = [];
      for (const choice of bodyRes.choices) {
        if (!choice?.message?.content) {
          continue;
        }
        translations.push(choice.message.content.trim());
      }
      return translations;
    }
  }
}
