
import { describe, expect, test } from "vitest";
import translator, { engines } from "../src"

describe("translator", () => {
  test("Translate hello from en to es", () => {
    translator.useEngine(engines.google({}));
    const res = translator.translate("hello", { from: "en", to: "es", engine: "google" });

    expect(res).toBe("Hola");
  });
});

