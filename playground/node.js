import { translator, engines } from "../dist/index.js"

translator.use(engines.google());
const res = await translator.translate("hello", { from: "en", to: "zh" });
console.log(res);


