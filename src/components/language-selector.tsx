import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages, resolveLanguage, useLanguage } from "@/lib/language";

const names = { pl: "Polski", en: "English", ru: "Русский" };
export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <Select value={language} onValueChange={(value) => setLanguage(resolveLanguage(value))}>
      <SelectTrigger aria-label={t("Language")} className="h-9 w-auto gap-2 rounded-full border-border bg-card/90 px-3 text-xs text-card-foreground backdrop-blur">
        <Globe className="size-3.5" /><SelectValue />
      </SelectTrigger>
      <SelectContent>{languages.map((value) => <SelectItem key={value} value={value}>{names[value]}</SelectItem>)}</SelectContent>
    </Select>
  );
}