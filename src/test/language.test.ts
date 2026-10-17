import { describe, expect, it } from "vitest";
import { languages, resolveLanguage } from "@/lib/language";

describe("Interface language selection", () => {
  it("supports Polish", () => { expect(languages).toContain("pl"); expect(resolveLanguage("pl")).toBe("pl"); });
  it("supports English", () => { expect(languages).toContain("en"); expect(resolveLanguage("en")).toBe("en"); });
  it("supports Russian", () => { expect(languages).toContain("ru"); expect(resolveLanguage("ru")).toBe("ru"); });
  it("falls back to Polish for an unsupported saved preference", () => { expect(resolveLanguage("de")).toBe("pl"); });
});