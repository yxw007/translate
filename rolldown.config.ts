import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, type OutputOptions, type RolldownOptions } from "rolldown";
import { viteAliasPlugin } from "rolldown/experimental";

type BuildVariant = {
  browser?: boolean;
  minifiedVersion?: boolean;
  minify?: boolean;
  output: OutputOptions;
  plugins?: NonNullable<RolldownOptions["plugins"]>;
};

const packageJson = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  name: string;
  version: string;
  author: string;
  peerDependencies?: Record<string, string>;
};
const pkgName = packageJson.name;
const libName = pkgName.split("/").pop() ?? pkgName;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = "src/index.ts";
const external = Object.keys(packageJson.peerDependencies || {});
const externalGlobals: Record<string, string> = {
  "@aws-sdk/client-translate": "AwsSdkClientTranslate",
  "@smithy/smithy-client": "SmithyClient",
  "crypto-js": "CryptoJS",
};

function withMinifiedFilename(file: string, minified: boolean) {
  if (!minified) {
    return file;
  }

  const extension = path.extname(file);
  const basename = path.basename(file, extension);
  const extensionParts = extension.split(".");
  extensionParts.shift();

  return `${path.dirname(file)}/${basename}.${["min", ...extensionParts].join(".")}`;
}

function createBuildVariants({
  browser = true,
  minifiedVersion = true,
  minify = false,
  output,
  plugins = [],
}: BuildVariant): RolldownOptions[] {
  const buildVariant = (shouldMinify: boolean): RolldownOptions => ({
    input,
    external,
    platform: browser ? "browser" : "node",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      viteAliasPlugin({
        entries: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
      }),
      ...plugins,
    ],
    output: {
      ...output,
      codeSplitting: false,
      globals: output.format === "umd" ? externalGlobals : output.globals,
      minify: shouldMinify,
      file: withMinifiedFilename(output.file as string, shouldMinify),
    },
  });

  const builds = [buildVariant(minify)];

  if (minifiedVersion) {
    builds.push(buildVariant(true));
  }

  return builds;
}

export default defineConfig((commandArgs) => {
  const isDev = Boolean(commandArgs?.dev);
  const isRelease = !isDev;
  const year = new Date().getFullYear();
  const banner = `// ${libName} v${packageJson.version} Copyright (c) ${year} ${packageJson.author} and contributors`;

  return [
    ...createBuildVariants({
      browser: false,
      minifiedVersion: isRelease,
      output: {
        file: "dist/node/index.js",
        format: "esm",
        exports: "named",
        sourcemap: isDev,
        banner,
      },
    }),
    ...createBuildVariants({
      browser: false,
      minifiedVersion: isRelease,
      output: {
        file: "dist/node/index.cjs",
        format: "cjs",
        exports: "named",
        sourcemap: isDev,
        banner,
      },
    }),
    ...createBuildVariants({
      browser: true,
      minifiedVersion: isRelease,
      output: {
        file: "dist/browser/index.umd.js",
        format: "umd",
        name: libName,
        exports: "named",
        sourcemap: isDev,
        banner,
      },
    }),
    ...createBuildVariants({
      browser: true,
      minifiedVersion: isRelease,
      output: {
        file: "dist/browser/index.esm.js",
        format: "esm",
        name: libName,
        exports: "named",
        sourcemap: isDev,
        banner,
      },
    }),
    ...createBuildVariants({
      browser: true,
      minifiedVersion: isRelease,
      output: {
        file: "dist/browser/index.cjs",
        format: "cjs",
        name: libName,
        exports: "named",
        sourcemap: isDev,
        banner,
      },
    }),
  ];
});
