import { google } from "./google";
import { azure } from "./azure";
import { amazon } from "./amazon";
import { baidu } from "./baidu";

export const engines = {
  google,
  azure,
  amazon,
  baidu,
} as const;
