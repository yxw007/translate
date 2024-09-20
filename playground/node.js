import { translator, engines } from "../dist/node/index.js"

translator.use(engines.google());
const res = await translator.translate("hello", { from: "en", to: "zh" });
console.log(res);


