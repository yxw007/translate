import baidu from "./baidu";
import { builtinEngineLanguages } from "../engines";

export const checkLanguages = {
  amazon: builtinEngineLanguages.amazon.from,
  azure: builtinEngineLanguages.azure.from,
  baidu,
  deepl: builtinEngineLanguages.deepl.from,
  google: builtinEngineLanguages.google.from,
  openai: builtinEngineLanguages.openai.from,
  tencent: builtinEngineLanguages.tencent.from,
} as const;
