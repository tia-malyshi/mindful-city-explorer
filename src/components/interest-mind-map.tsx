import { Trees, Dumbbell, Music, Users, Coffee, Lightbulb, UserRound, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { profileInterests } from "@/lib/profile-interests";
import type { ReflectionRow } from "@/lib/personal-data";
import { ReflectionSource } from "@/components/memories-screen";

type Group = ReturnType<typeof profileInterests<ReflectionRow>>[number];
const icons = [Trees, Dumbbell, Music, Users, Coffee, Lightbulb];
const colors = {
  sage: "bg-sage text-primary-foreground hover:bg-sage", sky: "bg-sky text-primary-foreground hover:bg-sky",
  rose: "bg-rose text-primary-foreground hover:bg-rose", sun: "bg-sun text-primary-foreground hover:bg-sun",
  accent: "bg-accent text-accent-foreground hover:bg-accent", violet: "bg-violet text-primary-foreground hover:bg-violet",
};
const points = [[80, 160], [240, 160], [60, 360], [260, 360], [80, 560], [240, 560]];
const leafPoints = [[[38, 55], [122, 55]], [[198, 55], [282, 55]], [[38, 265], [38, 455]], [[282, 265], [282, 455]], [[38, 665], [122, 665]], [[198, 665], [282, 665]]];

export function InterestMindMap({ groups, active, setActive, unexplored, sourceId, setSourceId }: {
  groups: Group[]; active: string | null; setActive: (name: string | null) => void; unexplored: boolean;
  sourceId: string | null; setSourceId: (id: string | null) => void;
}) {
  const { t } = useLanguage();
  const selected = groups.find(group => group.name === active);
  const branches = groups.flatMap((group, index) => {
    const point = points[index];
    const ends = leafPoints[index];
    if (!point || !ends || (!unexplored && !group.weight)) return [];
    const values = unexplored ? group.values : group.selected;
    const leaves = [...values.map(value => ({ label: t(value), event: null as ReflectionRow | null })), ...group.events.map(event => ({ label: t(event.event_title), event }))].slice(0, 2);
    return [{ group, index, point, ends, leaves }];
  });
  return <>
    <div className="relative mx-auto h-[720px] w-full max-w-[340px]" aria-label={t("Your interest map")}>
      <svg viewBox="0 0 320 720" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full stroke-muted-foreground">
        {branches.map(({ group, point, ends, leaves }) => <g key={group.name} strokeWidth="1.5"><path d={`M 160 360 L ${point[0]} ${point[1]}`} className="fill-none" />{leaves.map((leaf, index) => { const end = ends[index]; return end ? <path key={leaf.label} d={`M ${point[0]} ${point[1]} L ${end[0]} ${end[1]}`} className="fill-none" /> : null; })}</g>)}
      </svg>
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground"><UserRound className="mb-1 size-6" /><strong className="text-base">{t("You")}</strong></div>
      {branches.map(({ group, index, point, ends, leaves }) => {
        const Icon = icons[index] ?? Lightbulb;
        return <div key={group.name}>
          <Button variant="ghost" aria-pressed={active === group.name} onClick={() => setActive(active === group.name ? null : group.name)} style={{ left: `${point[0] / 320 * 100}%`, top: point[1] }} className={`absolute flex size-[80px] -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-full p-2 ${colors[group.tone]} ${active === group.name ? "ring-2 ring-ring ring-offset-4 ring-offset-background" : ""}`}><Icon className="size-5 shrink-0" /><span className="w-full whitespace-normal text-center text-[11px] font-semibold leading-tight">{t(group.name)}</span></Button>
          {leaves.map((leaf, leafIndex) => {
            const end = ends[leafIndex];
            if (!end) return null;
            return <Button key={leaf.label} variant="ghost" title={leaf.label} aria-label={leaf.label} onClick={() => { setActive(group.name); setSourceId(leaf.event?.id ?? null); }} style={{ left: `${end[0] / 320 * 100}%`, top: end[1] }} className="absolute flex size-[66px] -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-full border border-sun bg-sun/90 p-2 text-primary-foreground hover:bg-sun">{leaf.event ? <><Star className="size-4" /><span className="text-xs font-semibold">{leaf.event.rating}/5</span><span className="text-[9px]">{new Date(leaf.event.created_at).getUTCDate()}.10</span></> : <span className="w-full whitespace-normal text-center text-[10px] font-medium leading-tight">{leaf.label}</span>}</Button>;
          })}
        </div>;
      })}
    </div>
    {selected && <div className="pb-2">
      <h4 className={`inline-flex min-h-12 items-center rounded-full px-4 text-sm font-semibold ${colors[selected.tone]}`}>{t(selected.name)}</h4>
      <div className="ml-6 border-l-2 border-muted-foreground/40 py-2">
        {(unexplored ? selected.values : selected.selected).map(value => <div key={value} className="relative py-2 pl-5 before:absolute before:left-0 before:top-1/2 before:w-4 before:border-t before:border-muted-foreground/40"><span className={`inline-block rounded-full border px-3 py-2 text-xs ${selected.selected.includes(value) ? "text-foreground" : "text-muted-foreground"}`}>{t(value)}</span></div>)}
        {selected.events.map(event => <div key={event.id} className="relative py-2 pl-5 before:absolute before:left-0 before:top-7 before:w-4 before:border-t before:border-muted-foreground/40"><Button variant="outline" aria-expanded={sourceId === event.id} onClick={() => setSourceId(sourceId === event.id ? null : event.id)} className="h-auto min-h-12 w-full justify-start gap-2 whitespace-normal rounded-lg px-3 py-2 text-left text-xs"><Star className="size-3 shrink-0 text-primary" /><span>{t(event.event_title)}</span><ChevronRight className="ml-auto size-3 shrink-0" /></Button>{sourceId === event.id && <ReflectionSource reflection={event} />}</div>)}
      </div>
    </div>}
  </>;
}