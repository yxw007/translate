import baidu from "./baidu";
import { originLanguages } from "../origin";

export const checkLanguages = Object.assign(Object.assign({}, originLanguages), {
  baidu: baidu,
});
