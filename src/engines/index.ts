import { google } from "./google";
import { azure } from "./azure";
import { amazon } from "./amazon";
import { baidu } from "./baidu";
import { deepl } from "./deepl";

export const engines = {
  google,
  azure,
  amazon,
  baidu,
  deepl,
} as const;

export type Engines = keyof typeof engines;
