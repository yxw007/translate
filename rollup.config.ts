import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json"
import { defineConfig } from "rollup";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "./package.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const external = [];

export default defineConfig([
	{
		input: "src/index.ts",
		output: [
			{
				file: "dist/index.js",
				format: "esm",
				sourcemap: true,
			},
			{
				file: "dist/index.cjs",
				format: "cjs",
				sourcemap: true,
			},
			{
				file: "dist/index.umd.js",
				format: "umd",
				name: pkg.name,
				sourcemap: true,
			},
		],
		plugins: [
			alias({
				entries: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
			}),
			json(),
			resolve({ browser: true, extensions: [".ts", ".js"] }),
			commonjs(),
			typescript({
				tsconfig: "./tsconfig.json",
				sourceMap: true,
			}),
		],
		external,
	},
	{
		input: "src/index.ts",
		output: [
			{
				file: "dist/index.d.ts",
				format: "esm",
				sourcemap: true,
			},
		],
		plugins: [
			alias({
				entries: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
			}),
			resolve({ browser: false, extensions: [".ts", ".js"] }),
			dts()
		],
		external,
	},
]);
