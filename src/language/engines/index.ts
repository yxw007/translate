import amazonLanguages from "./amazon";
import azureLanguages from "./azure";
import baiduLanguages from "./baidu";
import deeplLanguages from "./deepl";
import googleLanguages from "./google";
import openaiLanguages from "./openai";
import tencentLanguages from "./tencent";

export const builtinEngineLanguages = {
  amazon: amazonLanguages,
  azure: azureLanguages,
  baidu: baiduLanguages,
  deepl: deeplLanguages,
  google: googleLanguages,
  openai: openaiLanguages,
  tencent: tencentLanguages,
} as const;

type ValueOf<T> = T[keyof T];

export type BuiltinEngineLanguageMap = typeof builtinEngineLanguages;
export type BuiltinFromLanguageMap = {
  [K in keyof BuiltinEngineLanguageMap]:
    | Extract<keyof BuiltinEngineLanguageMap[K]["from"], string>
    | ValueOf<BuiltinEngineLanguageMap[K]["from"]>;
};
export type BuiltinToLanguageMap = {
  [K in keyof BuiltinEngineLanguageMap]:
    | Extract<keyof BuiltinEngineLanguageMap[K]["to"], string>
    | ValueOf<BuiltinEngineLanguageMap[K]["to"]>;
};
