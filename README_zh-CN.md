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
- 🌍 **支持多翻译引擎**：Google、Azure Translate、Amazon Translate、Deepl、Baidu、OpenAI等（未来将拓展更多）
- 🛠️ **typescript**: 更友好的代码提示和质量保障
- 📦 **批量翻译**：一次api请求，翻译更多内容，减少http请求提高翻译效率
- 🔓 **完全开源**

> **特别提醒：虽然库已支持浏览器环境使用，但是请仅使用google engine翻译(google不需要key)，使用其他翻译engine 需要配置key，在前端使用会导致key泄露，千万不要这么做**

## 💻翻译引擎，集成情况

| name             | 支持 | 描述                                                                       |
| ---------------- | ---- | -------------------------------------------------------------------------- |
| google           | ✔    | 已投产，可以正常使用                                                       |
| azure translate  | ✔    | 已投产，可以正常使用                                                       |
| amazon translate | ✔    | 已投产，可以正常使用                                                       |
| baidu            | ✔    | 已投产，可以正常使用                                                       |
| deepl            | ✔    | 已投产，可以正常使用                                                       |
| openai           | ✔    | 已投产，可以正常使用                                                       |
| tencent          | ✔    | 已投产，可以正常使用                                                       |
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

### Node

- ESM
  ```typescript
  import { translator, engines } from "@yxw007/translate"
  ```

- Commonjs
  ```typescript
  const { translator, engines }  = required("@yxw007/translate")
  ```

- 翻译例子
  ```typescript
  translator.addEngine(engines.google);
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
- 语言检测例子
  ```typescript
  translator.addEngine(engines.google);
  const res1 = await translator.checkLanguage("hello", { engine:"google" });
  console.log(res1);
  ```

  输出结果
  ```bash
  en
  ```

### Browser

使用 jsDelivr CDN

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
        translator.addEngine(engines.google);
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
  /**
   * This method is obsolete, please use the addEngine method
   * @param engine {@link Engine}  instance
   * @deprecated Use {@link addEngine} instead.
   */
  use(engine: Engine) {
    this.addEngine(engine);
  }
  addEngine(engine: Engine) {
   ...
  }
  removeEngine(engineName: string) {
   ...
  }
  getFromLanguages(engineName: string) {
   ...
  }
  getToLanguages(engineName: string) {
   ...
  }
  translate<T extends Engines>(text: string | string[], options: TranslateOptions<T>) {
    ...
  }
}
```

#### `use`

给translator添加翻译引擎

```typescript
export type Engine = {
  name: string;
  getFromLanguages: () => Record<string, string>;
  getToLanguages: () => Record<string, string>;
  normalFromLanguage: (language?: string) => string;
  normalToLanguage: (language?: string) => string;
  translate: (text: string | string[], opts: EngineTranslateOptions) => Promise<string[]>;
};
```

#### `translate`

可以传一个文本or传一个文本数组，将返回一个翻译后的Promise<string[]>

```typescript
translate: <T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) => Promise<string[]>;
```

#### `getFromLanguages` / `getToLanguages`

读取指定 Engine 的语言列表。

```typescript
translator.getFromLanguages("google")
translator.getToLanguages("google")
```

#### TranslateOptions

```typescript
export type TranslateOptions<T extends Engines> = {
  from?: FromLanguage<T>;
  to: ToLanguage<T>;
  engine?: T;
  /**
   * Cache time in milliseconds
   */
  cache_time?: number | undefined;
  /**
   * Domain to use for translation
   */
  domain?: string | undefined;
};
```

> 提示：现在每个 Engine 都单独维护自己的 `from`/`to` 语言配置，可直接查看 `src/language/engines/*`。

### 各翻译Engine的Option

#### BaseEngineOption

```typescript
interface BaseEngineOption {
  fromLanguages?: Record<string, string>;
  toLanguages?: Record<string, string>;
}
```

> `fromLanguages` / `toLanguages` 仅用于某些工厂型 engine 初始化时传入自定义语言表，不会作为 engine 实例的公开字段暴露给上层。

#### 自定义 Engine

```typescript
import { Translator, type Engine } from "@yxw007/translate";

const translator = new Translator();

const fromLanguages = { Auto: "auto", English: "en" };
const toLanguages = { Chinese: "zh", Japanese: "ja" };

const customEngine: Engine = {
  name: "custom",
  getFromLanguages() {
    return fromLanguages;
  },
  getToLanguages() {
    return toLanguages;
  },
  normalFromLanguage(language) {
    if (!language || language === "auto") return "auto";
    return fromLanguages[language as keyof typeof fromLanguages] ?? "";
  },
  normalToLanguage(language) {
    if (!language) return "";
    return toLanguages[language as keyof typeof toLanguages] ?? "";
  },
  async translate(text, options) {
    const list = Array.isArray(text) ? text : [text];
    return list.map((item) => `[${options.from}->${options.to}] ${item}`);
  },
};

translator.addEngine(customEngine);
```

内置 engine 直接引用即可：

```typescript
translator.addEngine(engines.google);
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

#### DeeplEngineOption

```typescript
export interface DeeplEngineOption {
  key: string;
}
```

> 说明：option param 请从对应平台获取

- 相关文档：https://www.deepl.com/en/your-account/keys

#### OpenAIEngineOption

```typescript
export interface OpenAIEngineOption {
  apiKey: string;
  model: OpenAIModel;
}

export const OPEN_AI_MODELS = [
  "o1-preview",
  "o1-preview-2024-09-12",
  "o1-mini-2024-09-12",
  "o1-mini",
  "dall-e-2",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0125",
  "babbage-002",
  "davinci-002",
  "dall-e-3",
  "text-embedding-3-large",
  "gpt-3.5-turbo-16k",
  "tts-1-hd-1106",
  "text-embedding-ada-002",
  "text-embedding-3-small",
  "tts-1-hd",
  "whisper-1",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-instruct",
  "gpt-4o-mini-2024-07-18",
  "gpt-4o-mini",
  "tts-1",
  "tts-1-1106",
  "gpt-3.5-turbo-instruct-0914",
] as const;

export type OpenAIModel = (typeof OPEN_AI_MODELS)[number];
```

> 说明：option param 请从对应平台获取

- 相关文档：https://platform.openai.com/settings/organization/api-keys

#### TencentEnginOption

```typescript
export interface TencentEngineOption extends BaseEngineOption {
	secretId: string;
	secretKey: string;
	region?: string;
}
```

> 说明：option param 请从对应平台获取。
- 相关文档：https://console.cloud.tencent.com/cam/capi

- region 配置表
  | 地域                   | 取值             |
  | ---------------------- | ---------------- |
  | 亚太东南（曼谷）       | ap-bangkok       |
  | 华北地区（北京）       | ap-beijing       |
  | 西南地区（成都）       | ap-chengdu       |
  | 西南地区（重庆）       | ap-chongqing     |
  | 华南地区（广州）       | ap-guangzhou     |
  | 港澳台地区（中国香港） | ap-hongkong      |
  | 亚太东北（首尔）       | ap-seoul         |
  | 华东地区（上海）       | ap-shanghai      |
  | 华东地区（上海金融）   | ap-shanghai-fsi  |
  | 华南地区（深圳金融）   | ap-shenzhen-fsi  |
  | 亚太东南（新加坡）     | ap-singapore     |
  | 亚太东北（东京）       | ap-tokyo         |
  | 欧洲地区（法兰克福）   | eu-frankfurt     |
  | 美国东部（弗吉尼亚）   | na-ashburn       |
  | 美国西部（硅谷）       | na-siliconvalley |


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
        name: "xx",
        async checkLanguage<T extends Engines>(text: string): Promise<string> {
          //TODO: 可以用translate来实现，这样的话就复用target语言配置
        },
        async translate<T extends Engines>(text: string | string[], opts: EngineTranslateOptions<T>) {
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
    import { xxx } from "./xxx";
    export const engines = {
      google,
      azure,
      amazon,
      baidu,
      deepl,
      openai,
      xxx
    } as const;
    ```
  - 添加对应Engine支持的origin语言配置

    ```typescript
    //说明：如果origin与target语言都一样，那么可以直接用target语言配置即可，否则请单独配置
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

  - 添加对应Engine支持的target语言配置

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
