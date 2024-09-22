import azure from "./azure";
import google from "./google";
import baidu from "./baidu";
import deepl from "./deepl";
import amazon from "./amazon";
import { ValuesOf } from "../../utils";

export const targetLanguages = {
  azure: azure,
  google: google,
  baidu: baidu,
  deepl: deepl,
  amazon: amazon,
} as const;

export type targetLanguageMapNames = {
  amazon: keyof typeof amazon;
  azure: keyof typeof azure;
  google: keyof typeof google;
  baidu: keyof typeof baidu;
  deepl: keyof typeof deepl;
};

export type targetLanguageMapValues = {
  amazon: ValuesOf<typeof amazon>;
  azure: ValuesOf<typeof azure>;
  google: ValuesOf<typeof google>;
  baidu: ValuesOf<typeof baidu>;
  deepl: ValuesOf<typeof deepl>;
};