import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import { LanguageChoice } from "@/components/language-choice";

afterEach(() => { cleanup(); localStorage.clear(); });
describe("Language before questions", () => {
  it("saves the chosen language before advancing to questions", () => {
    const next = vi.fn();
    render(<LanguageProvider><LanguageChoice next={next} back={() => {}} /></LanguageProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Русский" }));
    expect(localStorage.getItem("mojawawa-language")).toBe("ru");
    expect(next).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Далее" }));
    expect(next).toHaveBeenCalledTimes(1);
  });
});