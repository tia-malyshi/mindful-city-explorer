import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import { ProfileMenu } from "@/components/profile-menu";

afterEach(() => { cleanup(); localStorage.clear(); });
it("shows the user's selected questionnaire interests and opens account settings", () => {
  localStorage.setItem("mojawawa-language", "en");
  const settings = vi.fn();
  render(<LanguageProvider><ProfileMenu close={() => {}} settings={settings} quest={() => {}} name="" setName={() => {}} answers={[{ question: "What interests you?", values: ["Nature & walks", "Photography"] }]} /></LanguageProvider>);
  expect(screen.getByText("Nature & walks · Photography")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Account settings" }));
  expect(settings).toHaveBeenCalledTimes(1);
});