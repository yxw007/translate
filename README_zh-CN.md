# Translate

简体中文 | [English](./README.md)

![GitHub top language](https://img.shields.io/github/languages/top/yxw007/translate)
![GitHub License](https://img.shields.io/github/license/yxw007/translate)
![NPM Version](https://img.shields.io/npm/v/%40yxw007%2Ftranslate)
![Codecov](https://codecov.io/gh/yxw007/translate/branch/master/graph/badge.svg)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/yxw007/translate/ci.yml)

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

## 💻翻译引擎，集成情况

| name             | 支持 | 描述                                                                       |
| ---------------- | ---- | -------------------------------------------------------------------------- |
| google           | √    | 已投产，可以正常使用                                                       |
| azure translate  | √    | 已投产，可以正常使用                                                       |
| amazon translate | √    | 已投产，可以正常使用                                                       |
| baidu            | √    | 已投产，可以正常使用                                                       |
| yandex           |      | 由于我没有平台支持的银行账号，所以未调通（欢迎有条件的朋友帮忙调通，感谢） |


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

### Browser

- ESM
  ```typescript
  import { translator, engines } from "@yxw007/translate"
  ```
- Commonjs
  ```typescript
  const { translator, engines }  = required("@yxw007/translate")
  ```
- example
  ```typescript
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

### Browser

使用 jsDelivr CDN 

- `development`
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@yxw007/translate@0.0.1-alpha.3/dist/browser/index.umd.js"></script>
  ```
  
- `production`

  ```html
  <script src="https://cdn.jsdelivr.net/npm/@yxw007/translate@0.0.1-alpha.3/dist/browser/index.umd.min.js"></script>
  ```

- example

  ```html
  <!DOCTYPE html>
  ...

  <head>
    ...
    <script src="https://cdn.jsdelivr.net/npm/@yxw007/translate@0.0.1-alpha.3/dist/browser/index.umd.js"></script>
  </head>

  <body>
    <script>
      (async () => {
        const { engines, translator } = translate;
        translator.use(engines.google());
        const res = await translator.translate("hello", { from: "en", to: "zh" });
        console.log(res);
      })();
    </script>
  </body>

  </html>

  ```

## 📚 API 

### Translator

```typescript
class Translator {
  private engines: Map<string, Engine>;
  constructor() {
    this.engines = new Map<string, Engine>();
  }
  use(engine: Engine) {
   ...
  }
  translate(text: string | string[], options: TranslateOptions) {
    ...
  }
}
```

#### `use`

给translator添加翻译引擎

```typescript
type Engine = {
  name: string;
  translate: (text: string | string[], opts: EngineTranslateOptions) => Promise<string[]>;
};
```

#### `translate`

可以传一个文本or传一个文本数组，将返回一个翻译后的Promise<string[]>

```typescript
translate(text: string | string[], options: TranslateOptions)
```

#### TranslateOptions

```typescript
export interface TranslateOptions {
  from: Language;
  to: Language;
  engine?: string;
   /**
   * Cache time in milliseconds
   */
  cache_time?: number;
  domain?: string;
}
```

### 各翻译Engine的Option

#### BaseEngineOption

```typescript
interface BaseEngineOption {}
```

#### AzureEngineOption

```typescript
interface AzureEngineOption extends BaseEngineOption {
  key: string;
  region: string;
}
```

> 说明：option param 请从对应平台获取

- 相关文档：[rest-api-guide](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/reference/rest-api-guide?WT.mc_id=Portal-Microsoft_Azure_ProjectOxford)


#### AmazonEngineOption

```typescript
interface AmazonEngineOption extends BaseEngineOption{
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}
```

> 说明：option param 请从对应平台获取

- 相关文档：https://docs.aws.amazon.com/translate/latest/dg/what-is.html
- 相关库：https://www.npmjs.com/package/@aws-sdk/client-translate
 
#### BaiduEngineOption

```typescript
export interface BaiduEngineOption extends BaseEngineOption {
  appId: string;
  secretKey: string;
}
```

> 说明：option param 请从对应平台获取

- 相关文档：https://fanyi-api.baidu.com/product/121

## 🤝 贡献

> 特别注意：请基于master创建一个新分支，在新分支上开发，开发完后创建PR至master

- 安装依赖

  ```bash
  pnpm install
  ```

- 添加新Engine

  - 添加新平台engine插件
    ```typescript
    export interface XXEngineOption extends BaseEngineOption {
      key: string;
    }

    export function xx(options: XXEngineOption): Engine {
      const { key } = options;
      const base = "https://translate.yandex.net/api/v1.5/tr.json/translate";
      return {
        name: "yandex",
        async translate(text: string | string[], opts: EngineTranslateOptions): Promise<string[]> {
          const { from, to } = opts;
          if (!Array.isArray(text)) {
            text = [text];
          }
          //TODO: 调用平台翻译api
          const translations: string[] = [];
          //TODO: 解析平台API相应结果，将结果解析至translations返回
          for (const translation of body.text) {
            if (translation) {
              translations.push(translation);
            }
          }
          return translations;
        },
      };
    }
    ```
  - 将插件添加至engines(位置：```/src/engines/index.ts```)
  
    ```typescript
    import { xx } from "./xx";
    export const engines = {
      google,
      azure,
      amazon,
      baidu,
      xx
    } as const;
    ```
- 打包
  ```bash
  pnpm build
  ```

- 测试
  ```bash
  pnpm test
  ```

> **提示：目前库已可以正常使用，欢迎大家体验、如果你有任何问题和建议都可以提Issue给我反馈。
如果你感兴趣，特别欢迎你的加入，让我们一起完善好这个工具。
帮忙点个star⭐，让更多人知道这个工具，感谢大家🙏**

## 🌹 特别致谢
- [franciscop/translate](https://github.com/franciscop/translate.git)

> 说明：感谢[franciscop/translate](https://github.com/franciscop/translate.git)为我快速实现这个库提供了思路，同时也间接了他的部分代码。非常感谢🙏

## 📄 许可证

Translate 是在 MIT 许可证下发布的。详情请见 [`LICENSE`](./LICENSE) 文件。
