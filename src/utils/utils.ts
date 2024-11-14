export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGapLine() {
  return "-".repeat(20);
}

export function getErrorMessages<T extends Error>(e: T, prefix = "Translate fail ! "): string {
  if (e instanceof TypeError) {
    return prefix + ((e.cause as any).message ?? e.message);
  }
  return prefix + e.message;
}
