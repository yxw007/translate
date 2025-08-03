import baidu from "./baidu";
import tencent from "./tencent";
import azure from "./azure";
import amazon from "./amazon";
import deepl from "./deepl";
import google from "./google";

export const checkLanguages = {
  baidu: baidu,
  tencent: tencent,
  azure: azure,
  amazon: amazon,
  deepl: deepl,
  google: google,
} as const;
