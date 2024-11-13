export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGapLine() {
  return "-".repeat(20);
}
