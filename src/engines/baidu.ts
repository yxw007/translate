import { BaseEngineOption, Engine, EngineTranslateOptions, TranslationError } from "../types";
import md5 from "crypto-js/md5";
import { Engines } from "..";
import { throwResponseError } from "@/utils";

export interface BaiduEngineOption extends BaseEngineOption {
  appId: string;
  secretKey: string;
}

export function baidu(options: BaiduEngineOption): Engine {
  const { appId, secretKey } = options;
  const url = "https://fanyi-api.baidu.com/api/trans/vip/fieldtranslate";
  const name = "baidu";
  const checkOptions = () => {
    if (!appId || !secretKey) {
      throw new TranslationError(name, `${name} appId and secretKey is required`);
    }
  };
  checkOptions();

  return {
    name,
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) {
      checkOptions();
      const { to, from = "auto", domain = "it" } = opts;
      if (!Array.isArray(text)) {
        text = [text];
      }

      const q = text.join("\n");
      const salt = Date.now();
      const sign = md5(`${appId}${q}${salt}${domain}${secretKey}`).toString();
      const body = new URLSearchParams();
      body.append("q", q);
      body.append("from", from as string);
      body.append("to", to as string);
      body.append("appid", appId);
      body.append("salt", salt.toString());
      body.append("domain", domain);
      body.append("sign", sign);

      const res: any = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }
      const data = await res.json();
      if (!data || data.error_code || !data.trans_result || data.trans_result.length === 0) {
        throw new TranslationError(
          this.name,
          `Translate fail ! error_code:${data.error_code}, error_msg: ${data.error_msg} \n Go to https://fanyi-api.baidu.com/product/123 view details`
        );
      }

      const translations: string[] = [];
      for (const translation of data.trans_result) {
        if (translation.dst) {
          translations.push(translation.dst);
        }
      }

      return translations;
    },
    async checkLanguage<T extends Engines>(text: string): Promise<string> {
      checkOptions();
      const salt = Date.now();
      const sign = md5(`${appId}${text}${salt}${secretKey}`).toString();
      const body = new URLSearchParams();
      body.append("q", text);
      body.append("appid", appId);
      body.append("salt", salt.toString());
      body.append("sign", sign);

      const res: any = await fetch("https://fanyi-api.baidu.com/api/trans/vip/language", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!res.ok) {
        throw await throwResponseError(this.name, res);
      }
      const response = await res.json();
      if (!response || response.error_code != 0) {
        throw new TranslationError(
          this.name,
          `Check language fail ! error_code:${response.error_code}, error_msg: ${response.error_msg} \n Go to https://fanyi-api.baidu.com/product/143 view details`
        );
      }

      return response.data.src;
    },
  };
}
