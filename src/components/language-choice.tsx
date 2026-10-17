import { Check, ChevronLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { languages, useLanguage } from "@/lib/language";

const names = { pl: "Polski", en: "English", ru: "Русский" };
export function LanguageChoice({ next, back }: { next: () => void; back: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const title = language === "pl" ? "Wybierz język" : language === "ru" ? "Выберите язык" : "Choose your language";
  return (
    <div className="flex h-full flex-col px-6 pb-10 pt-12">
      <Button variant="ghost" size="icon" aria-label={t("‹ Back")} onClick={back}><ChevronLeft /></Button>
      <div className="flex flex-1 flex-col justify-center gap-7">
        <Globe className="size-10 text-primary" />
        <h2 className="font-display text-3xl font-semibold leading-snug">{title}</h2>
        <div className="space-y-3" role="group" aria-label={title}>
          {languages.map((value) => <Button key={value} variant={value === language ? "default" : "outline"} aria-pressed={value === language} onClick={() => setLanguage(value)} className="h-16 w-full justify-between rounded-lg px-5 text-base">{names[value]}{value === language && <Check className="size-5" />}</Button>)}
        </div>
      </div>
      <Button onClick={next} className="h-14 w-full rounded-full text-base font-bold">{t("Continue")}</Button>
    </div>
  );
}