import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations } from "./translations";

export const languages = ["pl", "en", "ru"] as const;
export type Language = (typeof languages)[number];
export function resolveLanguage(value: unknown): Language {
  return value === "en" || value === "ru" ? value : "pl";
}
export function translate(language: Language, value: string | number | undefined): string {
  const text = String(value ?? "");
  const key = text.trim();
  let result = language === "en" ? key : translations[key]?.[language] ?? key;
  if (language === "en") {
    if (key === "Zwolnij i odkryj") result = "Slow down and discover";
    if (key === "swoją Warszawę") result = "your Warsaw";
    if (key === "Poznajmy się") result = "Let’s get to know you";
    if (key === "Dzień dobry, Ola") result = "Hello, Ola";
    if (key === "Pałac Kultury i Nauki widziany z warszawskiej ulicy") result = "Palace of Culture and Science seen from a Warsaw street";
  }
  return `${text.match(/^\s*/)?.[0] ?? ""}${result}${text.match(/\s*$/)?.[0] ?? ""}`;
}
const LanguageContext = createContext({ language: "pl" as Language, setLanguage: (_: Language) => {}, t: (text: string | number | undefined) => translate("pl", text) });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pl");
  useEffect(() => {
    try { setLanguageState(resolveLanguage(localStorage.getItem("mojawawa-language"))); } catch { /* Storage is optional. */ }
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const setLanguage = (value: Language) => {
    setLanguageState(value);
    try { localStorage.setItem("mojawawa-language", value); } catch { /* Keep working without storage. */ }
  };
  return <LanguageContext.Provider value={{ language, setLanguage, t: (text) => translate(language, text) }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);