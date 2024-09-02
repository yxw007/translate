export function useLogger(name: string = "") {
  return {
    log(...args: any) {
      this.info(...args);
    },
    info(...args: any) {
      console.log(`[translate ${name}]`, ...args);
    },
    error(...args: any) {
      console.error(`[translate ${name}]`, ...args);
    },
    warn(...args: any) {
      console.warn(`[translate ${name}]`, ...args);
    },
  };
}
