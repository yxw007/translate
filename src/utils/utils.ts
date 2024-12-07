import { TranslationError } from "..";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGapLine() {
  return "-".repeat(20);
}

export function getErrorMessages<T extends Error>(e: T, prefix = "Translate fail ! "): string {
  if (e instanceof TypeError) {
    return prefix + ((e.cause as any)?.message ?? e.message);
  }
  return prefix + e.message;
}

export async function throwResponseError(name: string, res: any) {
  let bodyRes = null;
  try {
    bodyRes = await res.json();
  } catch (e) {}
  return new TranslationError(name, `Translate fail ! ${res.status}: ${res.statusText} ${bodyRes?.message ?? ""}`);
}
