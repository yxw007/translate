import fs from "fs";
import path from "path";
import { execFileSync } from "node:child_process";
import { rolldown } from "rolldown";
import { fileURLToPath } from "url";
import configExport from "../rolldown.config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function build() {
  const resolvedConfig = typeof configExport === "function" ? await configExport({ dev: process.argv.includes("--dev") }) : configExport;
  const options = Array.isArray(resolvedConfig) ? resolvedConfig : [resolvedConfig];

  for (const option of options) {
    const build = await rolldown(option);
    const outputs = Array.isArray(option.output) ? option.output : [option.output];
    await Promise.all(outputs.map((output) => build.write(output)));
    await build.close();
  }

  execFileSync(
    process.execPath,
    [
      "./node_modules/typescript/bin/tsc",
      "--project",
      "./tsconfig.json",
      "--noEmit",
      "false",
      "--declaration",
      "--emitDeclarationOnly",
      "--outDir",
      "./dist",
    ],
    { cwd: path.resolve(__dirname, ".."), stdio: "inherit" },
  );

  fs.copyFileSync(path.resolve(__dirname, "../package.json"), path.resolve(__dirname, "../dist/package.json"));
}

build();
