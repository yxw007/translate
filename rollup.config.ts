import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import aliasPlugin from "@rollup/plugin-alias";
import json from "@rollup/plugin-json"
import terser from "@rollup/plugin-terser";
import { defineConfig, RollupOptions } from "rollup";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "./package.json";
import maxmin from "maxmin";
import chalk from "chalk";

const pkgName = pkg.name;
const libName = pkgName.split("/").pop();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const namedInput = "src/index.ts";

function bundleSize() {
	return {
		name: "rollup-plugin-bundle-size",
		generateBundle(options, bundle) {
			const asset = path.basename(options.file);
			const size = maxmin(bundle[asset].code, bundle[asset].code, true);
			console.log(`Created bundle ${chalk.cyan(asset)}: ${size.substr(size.indexOf(' → ') + 3)}`);
		}
	};
}

function buildConfig({ browser = true, minifiedVersion = true, isBundle = true, alias = [], ...config }): RollupOptions[] {
	const { file } = config.output;
	const ext = path.extname(file);
	const basename = path.basename(file, ext);
	const extArr = ext.split('.');
	extArr.shift();

	function getPlugins(minified: boolean) {
		const plugins = [
			aliasPlugin({
				entries: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
			}),
			json(),
			resolve({ browser }),
		]

		if (isBundle) {
			plugins.push(commonjs());
		}
		if (minified) {
			plugins.push(terser());
			plugins.push(bundleSize());
		}
		plugins.push(...(config.plugins || []));
		return plugins;
	}

	const build = ({ minified }) => ({
		input: namedInput,
		...config,
		output: [{
			...config.output,
			file: `${path.dirname(file)}/${basename}.${(minified ? ['min', ...extArr] : extArr).join('.')}`
		}],
		plugins: getPlugins(minified)
	});

	const configs = [build({ minified: false })];

	if (minifiedVersion) {
		configs.push(build({ minified: true }));
	}

	return configs;
}

export default defineConfig(() => {
	const year = new Date().getFullYear();
	const banner = `// ${libName} v${pkg.version} Copyright (c) ${year} ${pkg.author} and contributors`;

	const config = [

		//Node.js ESM Bundle 
		...buildConfig({
			browser: false,
			output: {
				file: "dist/node/index.js",
				format: "esm",
				sourcemap: true,
				banner,
				inlineDynamicImports: true,
			},
			plugins: [
				typescript({
					tsconfig: "./tsconfig.json",
					sourceMap: true,
				})
			]
		}),

		//Node.js CJS Bundle 
		...buildConfig({
			browser: false,
			output: {
				file: "dist/node/index.cjs",
				format: "cjs",
				sourcemap: true,
				banner,
				inlineDynamicImports: true,
			},
			plugins: [
				typescript({
					tsconfig: "./tsconfig.json",
					sourceMap: true,
				})
			]
		}),

		//Browser ESM Bundle
		...buildConfig({
			browser: true,
			output:
			{
				file: "dist/browser/index.umd.js",
				format: "umd",
				name: libName,
				sourcemap: true,
				banner,
				inlineDynamicImports: true,
			},
			plugins: [
				typescript({
					tsconfig: "./tsconfig.json",
					sourceMap: true,
				})
			]
		}),

		//Browser CJS Bundle
		...buildConfig({
			browser: true,
			output:
			{
				file: "dist/browser/index.cjs",
				format: "cjs",
				name: libName,
				sourcemap: true,
				banner,
				inlineDynamicImports: true,
			},
			plugins: [
				typescript({
					tsconfig: "./tsconfig.json",
					sourceMap: true,
				})
			]
		}),

		//declaration file
		...buildConfig({
			browser: false,
			minifiedVersion: false,
			output:
			{
				file: "dist/index.d.ts",
				format: "esm",
				sourcemap: true,
			},
			plugins: [
				dts(),
			]
		})
	]

	return config
})
