# Translate

English | [简体中文](./README_zh-CN.md)

![GitHub top language](https://img.shields.io/github/languages/top/yxw007/translate)
![GitHub License](https://img.shields.io/github/license/yxw007/translate)

## ❓ Why do I need translate?
1. a lot of translation tool libraries on the market, basically not very well-maintained
2. not written by ts, not friendly enough when using the prompts
3. single function, does not support batch translation Or only support a translation engine
4. ...

> Note: Translate helps you to solve all the above problems, and will expand more in the future!

## ✨ Features
- 🌐 **Multi-environment support**: Node environment, browser environment
- ✨ **Easy to use**: provides a concise API, you can easily help you to translate
- 🌍 **Multi-translation engine support**: Google, Azure Translate, etc. (will expand more in the future)
- 🛠️ **typescript**: friendlier code hints and quality assurance
- 📦 **Batch translation**: one api request, translate more content, reduce http requests to improve translation efficiency
- 🔓 **completely open source**.

## 🚀 Install

- npm

  ```bash
  npm install @yxw007/translate
  ```

- yarn

  ```bash
  yarn add @yxw007/translate
  ```

- pnpm 

  ```bash
  pnpm i @yxw007/translate
  ```

## 📖 Usage

- ESM

  ```typescript
  import { translator, engines } from "@yxw007/translate"

  translator.use(engines.google());
  const res1 = await translator.translate("hello", { from: "en", to: "zh" });
  console.log(res1);

  const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "google" });
  console.log(res2);
  ```

  output
  ```bash
  ['你好']
  ["你好", "好的"]
  ```

- Commonjs

  ```typescript
  const { translator, engines }  = required("@yxw007/translate")

  translator.use(engines.google());
  const res1 = await translator.translate("hello", { from: "en", to: "zh" });
  console.log(res1);

  const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "google" });
  console.log(res2);

  ```

  output
  ```bash
  ['你好']
  ["你好", "好的"]
  ```

## 📄 License

Translate is released under the MIT license. See the [`LICENSE`](./LICENSE) file.

