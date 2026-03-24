import tencentOriginLanguages from "../origin/tencent";
import tencentTargetLanguages from "../target/tencent";

export const tencentLanguages = {
  from: {
    ...tencentOriginLanguages,
  },
  to: tencentTargetLanguages,
} as const;

export default tencentLanguages;
