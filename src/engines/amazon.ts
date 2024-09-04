import { AmazonEngineOption, Engine, EngineTranslateOptions } from "@/types";
import { TranslateClient, TranslateTextCommand, TranslateTextResponse } from "@aws-sdk/client-translate";

export default function Amazon(options: AmazonEngineOption): Engine {
  const { region, accessKeyId, secretAccessKey } = options;
  return {
    name: "amazon",
    async translate(text: string | string[], opts: EngineTranslateOptions) {
      const { from, to } = opts;
      const translateClient = new TranslateClient({ region: region, credentials: { accessKeyId, secretAccessKey } });
      if (!Array.isArray(text)) {
        text = [text];
      }
      const command = new TranslateTextCommand({
        SourceLanguageCode: from,
        TargetLanguageCode: to,
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
