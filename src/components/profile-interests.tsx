import { useState } from "react";
import { Trees, Dumbbell, Music, Users, Coffee, Lightbulb, ChevronRight, MapPin, Star, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { profileInterests } from "@/lib/profile-interests";
import type { ProfileAnswer } from "@/components/profile-menu";
import type { ReflectionRow, MediaRow } from "@/lib/personal-data";
import { ReflectionSource } from "@/components/memories-screen";
import { generateSampleProfile } from "@/lib/sample-profile";
import { InterestMindMap } from "@/components/interest-mind-map";

const icons = [Trees, Dumbbell, Music, Users, Coffee, Lightbulb];
const tones = {
  sage: { stroke: "stroke-sage", text: "text-sage", border: "border-sage" },
  sky: { stroke: "stroke-sky", text: "text-sky", border: "border-sky" },
  rose: { stroke: "stroke-rose", text: "text-rose", border: "border-rose" },
  sun: { stroke: "stroke-sun", text: "text-sun", border: "border-sun" },
  accent: { stroke: "stroke-accent", text: "text-accent", border: "border-accent" },
  violet: { stroke: "stroke-violet", text: "text-violet", border: "border-violet" },
};

export function ProfileInterests({ answers, reflections: savedReflections = [], media = [] }: {
  answers: ProfileAnswer[]; reflections?: ReflectionRow[]; media?: MediaRow[];
}) {
  const { t, language } = useLanguage();
  const [active, setActive] = useState<string | null>(null);
  const [unexplored, setUnexplored] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [sampleMode, setSampleMode] = useState(savedReflections.length === 0);
  const [samples, setSamples] = useState(() => generateSampleProfile(() => 0.5));
  const reflections = sampleMode ? samples.map(item => ({ ...item, answers: { "What stayed with you?": t(String((item.answers as Record<string, string>)["What stayed with you?"])) } })) : savedReflections;
  const groups = profileInterests(answers, reflections);
  const total = groups.reduce((sum, group) => sum + group.weight, 0);
  const selectedCount = groups.reduce((sum, group) => sum + group.selected.length, 0);
  let angle = -90;
  const segments = groups.filter(group => group.weight > 0).map(group => {
    const sweep = group.weight / total * 360;
    const gap = Math.min(8, sweep / 4);
    const start = angle + gap / 2;
    const end = angle + sweep - gap / 2;
    angle += sweep;
    const point = (a: number) => [130 + 102 * Math.cos(a * Math.PI / 180), 130 + 102 * Math.sin(a * Math.PI / 180)];
    const a = point(start), b = point(end);
    return { ...group, path: `M ${a[0]} ${a[1]} A 102 102 0 ${end - start > 180 ? 1 : 0} 1 ${b[0]} ${b[1]}` };
  });
  return <div className="space-y-7">
    <div className="space-y-3 border-y py-3">
      <div className="flex flex-wrap gap-2"><Button size="sm" variant={sampleMode ? "default" : "outline"} aria-pressed={sampleMode} onClick={() => { setSampleMode(true); setSourceId(null); }}>{t("Sample activities")}</Button><Button size="sm" variant={!sampleMode ? "default" : "outline"} aria-pressed={!sampleMode} onClick={() => { setSampleMode(false); setSourceId(null); }}>{t("My saved activities")}</Button></div>
      {sampleMode && <div className="flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{t("Example data · not saved to your account")}</span><Button variant="ghost" size="icon" aria-label={t("Shuffle sample activities")} title={t("Shuffle sample activities")} onClick={() => { setSamples(generateSampleProfile()); setSourceId(null); }}><Shuffle className="size-4" /></Button></div>}
    </div>
    <section aria-label={t("My interests")}>
      <h3 className="font-display text-xl font-semibold">{t("My interests")}</h3>
      <div className="relative mx-auto aspect-square w-full max-w-[260px]">
        <svg viewBox="0 0 260 260" className="size-full" role="img" aria-label={t("Your interest map")}>
          <circle cx="130" cy="130" r="102" className="fill-none stroke-muted" strokeWidth="22" />
          {segments.map(segment => <path key={segment.name} d={segment.path} className={`fill-none ${tones[segment.tone].stroke} ${active && active !== segment.name ? "opacity-30" : ""}`} strokeWidth="22" strokeLinecap="round" />)}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <strong className="font-display text-5xl">{selectedCount}</strong><span className="mt-1 text-sm text-muted-foreground">{t("Selected interests")}</span>
          <span className="mt-2 text-xs text-muted-foreground">{reflections.length} {t("Saved experiences")}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">{groups.map((group, index) => {
        const Icon = icons[index] ?? Lightbulb;
        return <Button key={group.name} variant="ghost" aria-pressed={active === group.name} onClick={() => setActive(active === group.name ? null : group.name)} className={`h-auto min-h-11 justify-start gap-2 rounded-lg px-2 ${active === group.name ? "bg-muted" : ""}`}><Icon className={`size-4 shrink-0 ${tones[group.tone].text}`} /><span className="min-w-0 whitespace-normal text-left text-xs">{t(group.name)}</span><span className="ml-auto text-xs text-muted-foreground">{group.selected.length} / {group.events.length}</span></Button>;
      })}</div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>{t("Selected interests")}: {selectedCount}</span><span>{t("Reviewed activities")}: {reflections.length}</span></div>
    </section>
    <section className="border-t pt-6" aria-label={t("Mind map")}>
      <div className="mb-4 space-y-2"><h3 className="font-display text-xl font-semibold">{t("Mind map")}</h3><Button variant="link" size="sm" aria-pressed={unexplored} onClick={() => setUnexplored(!unexplored)} className="h-auto max-w-full justify-start whitespace-normal px-0 text-left text-xs text-primary">{t(unexplored ? "Hide unexplored interests" : "Show unexplored interests")}</Button></div>
      <InterestMindMap groups={groups} active={active} setActive={setActive} unexplored={unexplored} sourceId={sourceId} setSourceId={setSourceId} />
      {!total && !unexplored && <p className="mt-3 text-sm text-muted-foreground">{t("No interests selected yet")}</p>}
    </section>
    <section className="border-t pt-6" aria-label={t("Your activities")}>
      <h3 className="mb-1 font-display text-xl font-semibold">{t("Your activities")}</h3><p className="mb-4 text-xs text-muted-foreground">{t("Reviewed activities")}</p>
      {!reflections.length ? <p className="text-sm text-muted-foreground">{t("No saved experiences yet")}</p> : <div className="space-y-3">{reflections.map(item => {
        const photo = media.find(photo => photo.reflection_id === item.id && photo.kind === "photo");
        return <article key={item.id} className="rounded-lg border bg-card p-3">
          <div className="flex gap-3">{photo && <img src={photo.url} alt={t(item.event_title)} className="size-14 shrink-0 rounded-md object-cover" loading="lazy" />}<div className="min-w-0"><span className="text-xs text-sage">{t(sampleMode ? "Sample activity" : "Reviewed")}</span><h4 className="mt-1 text-sm font-semibold">{t(item.event_title)}</h4><p className="mt-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{item.district}<span>· {new Date(item.created_at).toLocaleDateString(language)}</span></p></div></div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2 text-xs"><span>{t("Rating")}: <strong className="text-primary">{item.rating}/5</strong></span><Button variant="link" aria-expanded={sourceId === item.id} className="h-auto whitespace-normal p-0 text-xs" onClick={() => setSourceId(sourceId === item.id ? null : item.id)}>{t("See original information")}<ChevronRight className="size-3" /></Button></div>
          {sourceId === item.id && <ReflectionSource reflection={item} />}
        </article>;
      })}</div>}
    </section>
  </div>;
}