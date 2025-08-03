import { Engine, EngineTranslateOptions, TranslationError } from "../types";
import { TranslateClient, TranslateTextCommand, TranslateTextResponse } from "@aws-sdk/client-translate";
import { Engines } from "..";

export interface AmazonEngineOption {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export function amazon(options: AmazonEngineOption): Engine {
  const { region, accessKeyId, secretAccessKey } = options;
  const name = "amazon";
  const checkOptions = () => {
    if (!region || !accessKeyId || !secretAccessKey) {
      throw new TranslationError(name, `${name} region, accessKeyId ,secretAccessKey is required`);
    }
  };

  checkOptions();

  return {
    name,
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) {
      checkOptions();
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
    async checkLanguage<T extends Engines>(text: string): Promise<string> {
      checkOptions();
      const translateClient = new TranslateClient({
        region: region,
        credentials: { accessKeyId, secretAccessKey },
      });

      const command = new TranslateTextCommand({
        SourceLanguageCode: "auto",
        TargetLanguageCode: "en",
        Text: text,
      });

      try {
        const response: TranslateTextResponse = await translateClient.send(command);

        if (!response.SourceLanguageCode) {
          throw new TranslationError(name, "Check language fail! Source language not detected");
        }

        return response.SourceLanguageCode;
      } catch (error: any) {
        throw new TranslationError(name, `Check language fail! ${error.message || error}`);
      }
    },
  };
}
