import { rollup } from "rollup";
import { loadConfigFile } from "rollup/loadConfigFile";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"


const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function build() {
	const { options } = await loadConfigFile(path.resolve(__dirname, "../rollup.config.ts"), {});

	for (const option of options) {
		const build = await rollup(option);
		await Promise.all(option.output.map(build.write));
	}

	fs.copyFileSync(path.resolve(__dirname, "../package.json"), path.resolve(__dirname, "../dist/package.json"));
}

build();

