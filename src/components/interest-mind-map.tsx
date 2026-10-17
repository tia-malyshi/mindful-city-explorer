import { Trees, Dumbbell, Music, Users, Coffee, Lightbulb, UserRound, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { profileInterests } from "@/lib/profile-interests";
import type { ReflectionRow } from "@/lib/personal-data";
import { ReflectionSource } from "@/components/memories-screen";

type Group = ReturnType<typeof profileInterests<ReflectionRow>>[number];
const icons = [Trees, Dumbbell, Music, Users, Coffee, Lightbulb];
const colors = {
  sage: "text-sage border-sage bg-sage/15", sky: "text-sky border-sky bg-sky/15",
  rose: "text-rose border-rose bg-rose/15", sun: "text-sun border-sun bg-sun/15",
  accent: "text-accent border-accent bg-accent/15", violet: "text-violet border-violet bg-violet/15",
};
const strokes = { sage: "stroke-sage", sky: "stroke-sky", rose: "stroke-rose", sun: "stroke-sun", accent: "stroke-accent", violet: "stroke-violet" };
const positions = ["left-0 top-4", "right-0 top-4", "left-0 top-[166px]", "right-0 top-[166px]", "left-0 bottom-4", "right-0 bottom-4"];
const points = [[44, 60], [276, 60], [44, 210], [276, 210], [44, 360], [276, 360]];

export function InterestMindMap({ groups, active, setActive, unexplored, sourceId, setSourceId }: {
  groups: Group[]; active: string | null; setActive: (name: string | null) => void; unexplored: boolean;
  sourceId: string | null; setSourceId: (id: string | null) => void;
}) {
  const { t } = useLanguage();
  const selected = groups.find(group => group.name === active);
  return <>
    <div className="relative mx-auto h-[420px] w-full max-w-[340px]" aria-label={t("Your interest map")}>
      <svg viewBox="0 0 320 420" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
        {groups.map((group, index) => {
          const point = points[index];
          if (!point || (!unexplored && !group.weight)) return null;
          return <path key={group.name} d={`M 160 210 Q 160 ${point[1]} ${point[0]} ${point[1]}`} className={`fill-none ${strokes[group.tone]} ${active && active !== group.name ? "opacity-20" : "opacity-70"}`} strokeWidth="2" strokeDasharray={group.weight ? undefined : "5 5"} />;
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground"><UserRound className="mb-1 size-6" /><strong className="text-base">{t("You")}</strong></div>
      {groups.map((group, index) => {
        if (!unexplored && !group.weight) return null;
        const Icon = icons[index] ?? Lightbulb;
        return <Button key={group.name} variant="ghost" aria-pressed={active === group.name} onClick={() => setActive(active === group.name ? null : group.name)} className={`absolute ${positions[index]} flex size-[88px] flex-col gap-1 rounded-full border-2 p-2 ${colors[group.tone]} ${group.weight ? "" : "border-dashed"} ${active && active !== group.name ? "opacity-40" : ""} ${active === group.name ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}><Icon className="size-5 shrink-0" /><span className="w-full whitespace-normal text-center text-[11px] font-semibold leading-tight">{t(group.name)}</span><span className="text-[10px]">{group.selected.length} / {group.events.length}</span></Button>;
      })}
    </div>
    {selected && <div className="pb-2">
      <h4 className={`inline-flex min-h-12 items-center rounded-full border px-4 text-sm font-semibold ${colors[selected.tone]}`}>{t(selected.name)}</h4>
      <div className="ml-6 border-l-2 border-muted-foreground/40 py-2">
        {(unexplored ? selected.values : selected.selected).map(value => <div key={value} className="relative py-2 pl-5 before:absolute before:left-0 before:top-1/2 before:w-4 before:border-t before:border-muted-foreground/40"><span className={`inline-block rounded-full border px-3 py-2 text-xs ${selected.selected.includes(value) ? "text-foreground" : "text-muted-foreground"}`}>{t(value)}</span></div>)}
        {selected.events.map(event => <div key={event.id} className="relative py-2 pl-5 before:absolute before:left-0 before:top-7 before:w-4 before:border-t before:border-muted-foreground/40"><Button variant="outline" aria-expanded={sourceId === event.id} onClick={() => setSourceId(sourceId === event.id ? null : event.id)} className="h-auto min-h-12 w-full justify-start gap-2 whitespace-normal rounded-lg px-3 py-2 text-left text-xs"><Star className="size-3 shrink-0 text-primary" /><span>{t(event.event_title)}</span><ChevronRight className="ml-auto size-3 shrink-0" /></Button>{sourceId === event.id && <ReflectionSource reflection={event} />}</div>)}
      </div>
    </div>}
  </>;
}