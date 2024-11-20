import { google } from "./google";
import { azure } from "./azure";
import { amazon } from "./amazon";
import { baidu } from "./baidu";
import { deepl } from "./deepl";
import { openai } from "./openai"

export const engines = {
  google,
  azure,
  amazon,
  baidu,
  deepl,
  openai
} as const;
