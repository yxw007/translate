import { Engine, EngineTranslateOptions, BaseEngineOption, TranslationError } from "../types";
import { Engines } from "..";
import crypto from "crypto";

export interface TencentEngineOption extends BaseEngineOption {
  secretId: string;
  secretKey: string;
  region?: string;
}

interface Authorization {
  secretId: string;
  secretKey: string;
  service: string;
  host: string;
  payload: string;
  httpRequestMethod: string;
  action: string;
  apiVersion: string;
  region?: string;
  token?: string;
}

function sha256(message: string, secret: string | Buffer = "", encoding?: "hex" | "base64"): string | Buffer {
  if (encoding) {
    return crypto.createHmac("sha256", secret).update(message).digest(encoding);
  }
  return crypto.createHmac("sha256", secret).update(message).digest();
}

function getHash(message: any, encoding: "hex" = "hex") {
  return crypto.createHash("sha256").update(message).digest(encoding);
}

function getDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}`;
}

function buildAuthorization({ secretId, secretKey, service, host, payload, httpRequestMethod, action, apiVersion, region }: Authorization) {
  const timestamp = Math.floor(Date.now() / 1000);
  const date = getDate(timestamp);
  const canonicalUri = "/";
  const canonicalQueryString = "";
  const canonicalHeaders = "content-type:application/json; charset=utf-8\nhost:" + host + "\n";
  const signedHeaders = "content-type;host";
  const hashedRequestPayload = getHash(payload);
  const canonicalRequest = [
    httpRequestMethod,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    hashedRequestPayload,
  ].join("\n");

  const algorithm = "TC3-HMAC-SHA256";
  const credentialScope = `${date}/${service}/tc3_request`;
  const hashedCanonicalRequest = getHash(canonicalRequest);
  const stringToSign = [algorithm, timestamp, credentialScope, hashedCanonicalRequest].join("\n");

  const kDate = sha256(date, "TC3" + secretKey);
  const kService = sha256(service, kDate);
  const kSigning = sha256("tc3_request", kService);
  const signature = sha256(stringToSign, kSigning, "hex");

  const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const headers: Record<string, any> = {
    Authorization: authorization,
    "Content-Type": "application/json; charset=utf-8",
    Host: host,
    "X-TC-Action": action,
    "X-TC-Timestamp": timestamp,
    "X-TC-Version": apiVersion,
  };
  if (region) headers["X-TC-Region"] = region;

  return headers;
}

export function tencent(options: TencentEngineOption): Engine {
  const { secretId, secretKey, region = "ap-guangzhou" } = options;
  const name = "tencent";
  const host = "tmt.tencentcloudapi.com";
  const endpoint = `https://${host}/`;
  const service = "tmt";
  const apiVersion = "2018-03-21";
  const action = "TextTranslate";

  function checkOptions() {
    if (!secretId || !secretKey) {
      throw new TranslationError(name, `${name} secretId and secretKey are required`);
    }
  }

  return {
    name,
    async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>): Promise<string[]> {
      checkOptions();
      const { from = "auto", to } = opts;
      const source = from === "auto" ? "" : from;
      const payloadObj = {
        SourceText: Array.isArray(text) ? text.join("\n") : text,
        Source: source,
        Target: to,
        ProjectId: 0,
      };
      const payload = JSON.stringify(payloadObj);

      const headers = buildAuthorization({
        secretId,
        secretKey,
        service,
        host,
        payload,
        httpRequestMethod: "POST",
        action,
        apiVersion,
        region,
      });

      try {
        const res: any = await fetch(endpoint, {
          method: "POST",
          headers,
          body: payload,
        });

        if (!res.ok) {
          throw new TranslationError(name, `HTTP ${res.status}: ${await res.text()}`);
        }
        const data = await res.json();
        if (data.Response?.Error) {
          throw new TranslationError(name, `Tencent translate fail: ${data.Response.Error.Code}, ${data.Response.Error.Message}`);
        }
        const translatedResults = data.Response?.TargetText.split("\n") ?? [];
        if (!Array.isArray(translatedResults) || translatedResults.length === 0) {
          throw new TranslationError(name, "Translate fail! No result returned");
        }
        return translatedResults;
      } catch (error) {
        if (error instanceof TranslationError) throw error;
        throw new TranslationError(name, `Translation failed: ${error}`);
      }
    },
  };
}
