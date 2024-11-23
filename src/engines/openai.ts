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

      const prompt = {
        role: "user",
        content: `Translate the following texts from ${from} to ${to}: 
          -$s$-
          ${text.join("\n")} 
          -$e$-
          Translated content is between the start marker -$s$- and the end marker -$e$-, do not return the start and end markers, only the translated text is returned.
          Connect multiple text with newline character, keep the original order when return. 
          `,
      };

      console.log("prompt:", prompt.content);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: "You are a professional IT translator" }, prompt],
          max_tokens: 2000,
        }),
      });

      const bodyRes = await (res as any).json();
      if (bodyRes.error) {
        throw new TranslationError(this.name, `Translate fail! message: ${bodyRes.error.message}`);
      }
      if (!bodyRes || !bodyRes.choices || bodyRes.choices.length === 0 || !bodyRes.choices[0]?.message?.content) {
        throw new TranslationError(this.name, "Translate fail ! translate's result is null or empty");
      }
      const content = bodyRes.choices[0].message.content;
      const translations = content
        .trim()
        .split("\n")
        .map((item: string) => item.trim());
      console.log("translations:", translations);

      return translations;
    },
  };
}
