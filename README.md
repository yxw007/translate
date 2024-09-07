# Translate

English | [简体中文](./README_zh-CN.md)

![GitHub top language](https://img.shields.io/github/languages/top/yxw007/translate)
![GitHub License](https://img.shields.io/github/license/yxw007/translate)
![NPM Version](https://img.shields.io/npm/v/%40yxw007%2Ftranslate)
![Codecov](https://codecov.io/gh/yxw007/translate/branch/master/graph/badge.svg)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/yxw007/translate/ci)

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

Add a translation engine to transitorion engine to translator

```typescript
type Engine = {
  name: string;
  translate: (text: string | string[], opts: EngineTranslateOptions) => Promise<string[]>;
};
```

#### `translate`

You can pass a text or pass a text array, which will return a translated ```Promise<string[]>```

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

### Each translation of Engine's Option

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

> Note: Option Param, please get it from the corresponding platform

- Relative document：[rest-api-guide](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/reference/rest-api-guide?WT.mc_id=Portal-Microsoft_Azure_ProjectOxford)


#### AmazonEngineOption

```typescript
interface AmazonEngineOption extends BaseEngineOption{
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}
```

> Note: Option Param, please get it from the corresponding platform

- Related documentationtive document：https://docs.aws.amazon.com/translate/latest/dg/what-is.html
- Related library：https://www.npmjs.com/package/@aws-sdk/client-translate
 
#### BaiduEngineOption

```typescript
export interface BaiduEngineOption extends BaseEngineOption {
  appId: string;
  secretKey: string;
}
```

> Note: Option Param, please get it from the corresponding platform

- Related documentation：https://fanyi-api.baidu.com/product/121

## 🤝 Contribute

> Special attention: Please create a new branch based on the master, develop on the new branch, and create PR to Master after development.

- Installation dependence

  ```bash
  pnpm install
  ```

- Add new Engine

  - Add a new platform ENGINE plugin
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
          //TODO: Call the platform translation APIplatform translation API
          const translations: string[] = [];
          //TODO: Analyze the corresponding results of the platform API, and resolve the results to the translations back
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
  - Add the plugin to Engines(Location:```/src/engines/index.ts```)
  
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
- Build
  ```bash
  pnpm build
  ```

- Test
  ```bash
  pnpm test
  ```

> **Tip: At present, the library can be used normally. Welcome everyone to experience. If you have any questions and suggestions, you can mention the feedback to me.If you are interested, you are welcome to join, let us improve this tool together.Help to click STAR 更, let more people know this tool, thank you for everyone🙏**

## 📄 License

Translate is released under the MIT license. See the [`LICENSE`](./LICENSE) file.

