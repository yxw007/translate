import { Engine, EngineTranslateOptions, BaseEngineOption, TranslationError, OpenAIModel, OPEN_AI_MODELS } from "../types";
import { Engines } from "..";

export interface OpenAIEngineOption extends BaseEngineOption {
  apiKey: string;
  model: OpenAIModel;
  maxTokens?: number;
}

export function openai(options: OpenAIEngineOption): Engine {
  const { apiKey, model, maxTokens = 2000 } = options;

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
        content: `
          翻译要求：
          1.将每段文本从${from}翻译为${to}
          2.文本内容以换行符\n进行段落分割，并以段落分割顺序进行翻译
          3.仅翻译分割出的段落，其他任何不相关的内容都移除，比如：段落前后的空格、所有标点符号
          4.仅返回要翻译的文本内容，不要返回任何其他内容
         
          
          如何提取翻译文本:
          1.翻译从-$s$-字符标记开始至-$e$-字符标记结束，提取-$s$-至-$e$-之间的内容
          2.-$s$-和-$e$-这2个标记不要返回，只是用来标记翻译的起始和结束位置

          -$s$-
          ${text.join("\n")} 
          -$e$-
          `,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: "You are a professional translator" }, prompt],
          max_tokens: maxTokens,
          temperature: 0,
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
      const marks = ["-$s$-", "-$e$-"];
      const translations = content
        .trim()
        .split("\n")
        .map((item: string) => item.trim())
        .filter(Boolean)
        .filter((it: string) => !marks.includes(it));

      return translations;
    },
  };
}
