# Translate

English | [简体中文](./README_zh-CN.md)

![GitHub top language](https://img.shields.io/github/languages/top/yxw007/translate)
![GitHub License](https://img.shields.io/github/license/yxw007/translate)
![NPM Version](https://img.shields.io/npm/v/%40yxw007%2Ftranslate)
![Codecov](https://codecov.io/gh/yxw007/translate/branch/master/graph/badge.svg)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/yxw007/translate/ci.yml)

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

> **Special reminder: although the library has supported the use of the browser environment, but please only use the google engine translation (google does not need key), the use of other translation engine need to configure the key, the use of the front-end will lead to key leakage, do not do it**

## 💻Translation engines, integration cases

| Name             | Support | Description                                                                                                                                               |
| ---------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| google           | √       | Commissioned and ready for use                                                                                                                            |
| azure translate  | √       | Commissioned and ready for use                                                                                                                            |
| amazon translate | √       | Commissioned and ready for use                                                                                                                            |
| baidu            | √       | Commissioned and ready for use                                                                                                                            |
| deepl            | √       | Commissioned and ready for use                                                                                                                            |
| yandex           |         | I have not tuned in as I do not have a bank account supported by the platform (help from those who are in a position to do so is welcome and appreciated) |

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

### Node

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

use jsDelivr CDN 

- `development`
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@yxw007/translate@0.0.7/dist/browser/index.umd.js"></script>
  ```
  
- `production`

  ```html
  <script src="https://cdn.jsdelivr.net/npm/@yxw007/translate@0.0.7/dist/browser/index.umd.min.js"></script>
  ```

- example

  ```html
  <!DOCTYPE html>
  ...

  <head>
    ...
    <script src="https://cdn.jsdelivr.net/npm/@yxw007/translate@0.0.7/dist/browser/index.umd.js"></script>
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
  translate<T extends Engines>(text: string | string[], options: TranslateOptions<T>) {
    ...
  }
}
```

#### `use`

Add a translation engine to transitorion engine to translator

```typescript
type Engine = {
  name: string;
  translate<T extends Engines>(text: string | string[], options: TranslateOptions<T>) {
};
```

#### `translate`

You can pass a text or pass a text array, which will return a translated ```Promise<string[]>```

```typescript
translate<T extends Engines>(text: string | string[], options: TranslateOptions<T>)
```

#### TranslateOptions

```typescript
export interface TranslateOptions {
  from?: FromLanguage<T>;
  to: ToLanguage<T>;
  engine?: Engines;
   /**
   * Cache time in milliseconds
   */
  cache_time?: number;
  /**
   * Domain to use for translation
   */
  domain?: string;
}
```

> Note: To learn more about the support of each engine language, go to the following directory to view the corresponding configurations

- from: [https://github.com/yxw007/translate/blob/master/src/language/origin/index.ts](https://github.com/yxw007/translate/blob/master/src/language/origin/index.ts)
- to: [https://github.com/yxw007/translate/blob/master/src/language/target/index.ts](https://github.com/yxw007/translate/blob/master/src/language/target/index.ts)

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

- Related document：https://docs.aws.amazon.com/translate/latest/dg/what-is.html
- Related library：https://www.npmjs.com/package/@aws-sdk/client-translate
 
#### BaiduEngineOption

```typescript
export interface BaiduEngineOption extends BaseEngineOption {
  appId: string;
  secretKey: string;
}
```

> Note: Option Param, please get it from the corresponding platform

- Related document：https://fanyi-api.baidu.com/product/121

#### DeeplEngineOption

```typescript
export interface DeeplEngineOption {
  key: string;
}
```

> Note: Option Param, please get it from the corresponding platform

- Related document：https://www.deepl.com/en/your-account/keys

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
        async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) {
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
      deepl,
      xx
    } as const;
    ```
  - Add the origin language configuration supported by the engine
 
    ```typescript
    //Note: If the origin and target languages are the same, you can directly use the target language to configure them, otherwise please configure them separately
    //src/language/origin/index.ts  
    import azure from "../target/azure";
    ...
    import xxx from "../target/xxx"
    
    export const originLanguages = {
      azure: azure,
      ...
      xxx: xxx,
    } as const;

    export type originLanguageMapNames = {
      amazon: keyof typeof amazon;
      ...
      xxx: keyof typeof xxx;
    };

    export type originLanguageMapValues = {
      amazon: ValuesOf<typeof amazon>;
      ...
      xxx: ValuesOf<typeof xxx>;
    };

    ```

  - Add the target language that is supported by the engine
 
    ```typescript
    //src/language/target/index.ts  
    import azure from "./azure";
    ...
    import xxx from "./amazon";

    export const targetLanguages = {
      azure: azure,
      ...
      xxx: xxx,
    } as const;

    export type targetLanguageMapNames = {
      amazon: keyof typeof amazon;
      ...
      xxx: keyof typeof xxx;
    };

    export type targetLanguageMapValues = {
      amazon: ValuesOf<typeof amazon>;
      ...
      xxx: ValuesOf<typeof xxx>;
    };

- Build
  ```bash
  pnpm build
  ```

- Test
  ```bash
  pnpm test
  ```

> **Tips: At present, the library can be used normally. Welcome everyone to experience. If you have any questions and suggestions, you can mention the feedback to me.If you are interested, you are welcome to join, let us improve this tool together. Help to click star ⭐, let more people know this tool, thank you for everyone🙏**


## 🌹 Thanks
- [franciscop/translate](https://github.com/franciscop/translate.git)

> Note：Thanks to [franciscop/translate](https://github.com/franciscop/translate.git) for giving me ideas for a quick implementation of this library, and also indirectly some of his code. Much appreciated.🙏

## 📄 License

Translate is released under the MIT license. See the [`LICENSE`](./LICENSE) file.

