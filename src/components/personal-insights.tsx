import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { usePersonalData } from "@/lib/personal-data";
import { reflectionSummary } from "@/lib/reflection-logic";
import { ReflectionSource } from "@/components/memories-screen";
import { AccountPanel } from "@/components/account-panel";
export function PersonalInsights() {
  const { t } = useLanguage(); const personal = usePersonalData(); const [sources, setSources] = useState(false);
  const stats = reflectionSummary(personal.data.reflections);
  const categories = [...new Set(personal.data.reflections.map(item => item.category))];
  return <div className="space-y-5 pt-2"><h2 className="font-display text-3xl font-black">{t("Insights")}</h2>{!personal.authReady || personal.loading ? <p>{t("Loading…")}</p> : !personal.user ? <AccountPanel /> : <>
    <p className="text-xs uppercase text-muted-foreground">{t("Saved experiences")}</p><div className="grid grid-cols-3 gap-2">{[[stats.count, "experiences"], [stats.average.toFixed(1), "avg rating"], [stats.districts, "districts"]].map(([value, label]) => <div key={label} className="rounded-lg bg-card px-2 py-4 text-center"><b className="block font-display text-2xl">{value}</b><span className="break-words text-[10px] text-muted-foreground">{t(String(label))}</span></div>)}</div>
    <div className="space-y-3 border-y py-5">{categories.map(category => <div key={category} className="flex justify-between text-sm"><span>{t(category)}</span><b>{personal.data.reflections.filter(item => item.category === category).length}</b></div>)}{!stats.count && <p className="text-sm text-muted-foreground">{t("No saved experiences yet")}</p>}</div>
    <Button variant="outline" className="w-full" aria-expanded={sources} onClick={() => setSources(!sources)}>{t("See original information")}</Button>{sources && <div className="space-y-4"><h3 className="font-display text-xl font-semibold">{t("Your answers")}</h3>{Array.isArray(personal.data.profile?.answers) && personal.data.profile.answers.map((answer, index) => {
      if (!answer || typeof answer !== "object" || Array.isArray(answer)) return null;
      return <div key={index} className="text-sm"><p className="text-xs text-muted-foreground">{t(String(answer['question'] ?? ""))}</p><p>{Array.isArray(answer['values']) ? answer['values'].map(value => t(String(value))).join(" · ") : ""}</p></div>;
    })}{personal.data.reflections.map(item => <ReflectionSource key={item.id} reflection={item} />)}</div>}
  </>}</div>;
}