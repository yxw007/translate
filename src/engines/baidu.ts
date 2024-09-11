import { BaseEngineOption, Engine, EngineTranslateOptions } from "../types";
import md5 from "crypto-js/md5";

export interface BaiduEngineOption extends BaseEngineOption {
  appId: string;
  secretKey: string;
}

export function baidu(options: BaiduEngineOption): Engine {
  const { appId, secretKey } = options;
  const url = "https://fanyi-api.baidu.com/api/trans/vip/fieldtranslate";
  return {
    name: "baidu",
    async translate(text: string | string[], opts: EngineTranslateOptions) {
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

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
      const data = await (res as any).json();
      if (!data || data.error_code || !data.trans_result || data.trans_result.length === 0) {
        throw new Error("Failed to translate text");
      }

      const translations: string[] = [];
      for (const translation of data.trans_result) {
        if (translation.dst) {
          translations.push(translation.dst);
        }
      }

      return translations;
    },
  };
}
