import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "./language-selector";
import { useLanguage } from "@/lib/language";

export function LanguageSettings({ close }: { close: () => void }) {
  const { language, t } = useLanguage();
  const title = language === "pl" ? "Ustawienia" : language === "ru" ? "Настройки" : "Settings";
  return (
    <div className="absolute inset-0 z-30 bg-background px-6 pb-10 pt-12" role="dialog" aria-modal="true" aria-label={title}>
      <div className="mb-10 flex items-center justify-between"><h2 className="font-display text-3xl font-semibold">{title}</h2><Button variant="ghost" size="icon" aria-label={language === "pl" ? "Zamknij ustawienia" : language === "ru" ? "Закрыть настройки" : "Close settings"} onClick={close}><X /></Button></div>
      <div className="flex items-center justify-between gap-3 border-b pb-5"><span className="font-medium">{t("Language")}</span><LanguageSelector /></div>
    </div>
  );
}