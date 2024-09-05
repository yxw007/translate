# Translate

简体中文 | [English](./README.md)

![GitHub top language](https://img.shields.io/github/languages/top/yxw007/translate)
![GitHub License](https://img.shields.io/github/license/yxw007/translate)

Translate 是一个支持多翻译引擎的翻译工具库，它提供了一套简单的api，让你可以轻松将一种语种翻译成另外一种语种。

## ❓ 为什么需要Translate?
1. 市面上不少翻译工具库，基本都不太维护了
2. 不是ts写的，使用时提示不够友好
3. 功能单一，不支持批量翻译 or 只支持一种翻译引擎
4. ...

> 说明：Translate 全部帮你搞定以上问题，未来将拓展更多内容

## ✨ 特点
- 🌐 **多环境支持**：Node环境、浏览器环境
- ✨ **简单易用**：提供了简洁的API，就可以轻松帮你翻译
- 🌍 **支持多翻译引擎**：Google、Azure Translate等（未来将拓展更多）
- 🛠️ **typescript**: 更友好的代码提示和质量保障
- 📦 **批量翻译**：一次api请求，翻译更多内容，减少http请求提高翻译效率
- 🔓 **完全开源**


## 🚀 安装

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

## 📖 使用

- ESM

  ```typescript
  import { translator, engines } from "@yxw007/translate"

  translator.use(engines.google());
  const res1 = await translator.translate("hello", { from: "en", to: "zh" });
  console.log(res1);

  const res2 = await translator.translate(["hello", "good"], { from: "en", to: "zh", engine: "google" });
  console.log(res2);
  ```

  输出结果
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

  输出结果
  ```bash
  ['你好']
  ["你好", "好的"]
  ```

## 📄 许可证

Translate 是在 MIT 许可证下发布的。详情请见 [`LICENSE`](./LICENSE) 文件。
