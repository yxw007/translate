import { google } from "./google";
import { azure } from "./azure";
import { amazon } from "./amazon";
import { baidu } from "./baidu";
import { deepl } from "./deepl";
import { openai } from "./openai";
import { tencent } from "./tencent";

export const engines = {
  google,
  azure,
  amazon,
  baidu,
  deepl,
  openai,
  tencent,
} as const;
