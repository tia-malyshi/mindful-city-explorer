import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import { AccountPanel } from "@/components/account-panel";
vi.mock("@/lib/personal-data", () => ({ usePersonalData: () => ({ user: null, signOut: vi.fn() }) }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: {} } }));
vi.mock("@/integrations/lovable/index", () => ({ lovable: { auth: {} } }));
afterEach(() => { cleanup(); localStorage.clear(); });
it("starts the post-question account panel in signup mode and permits switching to existing-account login", () => {
  localStorage.setItem("mojawawa-language", "en");
  render(<LanguageProvider><AccountPanel initialMode="signup" /></LanguageProvider>);
  expect(screen.getByRole("heading", { name: "Create account" })).toBeTruthy();
  expect(screen.getByLabelText("Password").getAttribute("autocomplete")).toBe("new-password");
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  expect(screen.getByLabelText("Password").getAttribute("autocomplete")).toBe("current-password");
});