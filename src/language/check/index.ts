import baidu from "./baidu";
import tencent from "./tencent";

export const checkLanguages = {
  baidu: baidu,
  tencent: tencent,
} as const;
