/**
 * Azure translate documentation: https://learn.microsoft.com/zh-cn/azure/ai-services/translator/reference/v3-0-translate
 */

import { AzureEngineOption, Engine, EngineTranslateOptions } from "@/types";

export default function Azure(options: AzureEngineOption): Engine {
  const { key, region } = options;
  const base = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
  return {
    name: "azure",
    async translate(text, opts: EngineTranslateOptions): Promise<string> {
      const { from, to } = opts;
      const url = `${base}&from=${from}&to=${to}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": region,
        },
        body: JSON.stringify([{ Text: text }]),
      });
      const body = await (res as any).json();
      const translated = body && body[0] && body[0].translations && body[0].translations[0].text;

      return translated;
    },
  };
}
