import { Engine, EngineTranslateOptions } from "../types";
import { TranslateClient, TranslateTextCommand, TranslateTextResponse } from "@aws-sdk/client-translate";

export interface AmazonEngineOption {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export function amazon(options: AmazonEngineOption): Engine {
  const { region, accessKeyId, secretAccessKey } = options;

  return {
    name: "amazon",
    async translate(text: string | string[], opts: EngineTranslateOptions) {
      const { from = "auto", to } = opts;
      const translateClient = new TranslateClient({ region: region, credentials: { accessKeyId, secretAccessKey } });
      if (!Array.isArray(text)) {
        text = [text];
      }
      const command = new TranslateTextCommand({
        SourceLanguageCode: from as string,
        TargetLanguageCode: to as string,
        Text: text.join("\n"),
      });
      const response: TranslateTextResponse = await translateClient.send(command);
      const translations: string[] = [];
      if (response.TranslatedText) {
        const translateText = response.TranslatedText ?? "";
        translations.push(...translateText.split("\n"));
      }
      return translations;
    },
  };
}
