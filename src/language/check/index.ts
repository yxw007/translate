import baidu from "./baidu";
import tencent from "./tencent";
import azure from "./azure";

export const checkLanguages = {
  baidu: baidu,
  tencent: tencent,
  azure: azure,
} as const;
