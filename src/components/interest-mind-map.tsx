import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { profileInterests } from "@/lib/profile-interests";
import type { ReflectionRow } from "@/lib/personal-data";
import { ReflectionSource } from "@/components/memories-screen";

type Group = ReturnType<typeof profileInterests<ReflectionRow>>[number];
const tones = {
  sage: { line: "stroke-sage", node: "border-sage bg-sage/20", dot: "bg-sage" },
  sky: { line: "stroke-sky", node: "border-sky bg-sky/20", dot: "bg-sky" },
  rose: { line: "stroke-rose", node: "border-rose bg-rose/20", dot: "bg-rose" },
  sun: { line: "stroke-sun", node: "border-sun bg-sun/20", dot: "bg-sun" },
  accent: { line: "stroke-accent", node: "border-accent bg-accent/20", dot: "bg-accent" },
  violet: { line: "stroke-violet", node: "border-violet bg-violet/20", dot: "bg-violet" },
};
const positions = [
  { node: [263, 202], leaves: [[310, 148], [315, 250]] },
  { node: [254, 117], leaves: [[239, 49], [311, 83]] },
  { node: [114, 116], leaves: [[59, 57], [133, 42]] },
  { node: [104, 286], leaves: [[45, 333], [117, 356]] },
  { node: [77, 203], leaves: [[43, 148], [43, 251]] },
  { node: [247, 287], leaves: [[235, 352], [312, 328]] },
];
const location = (point: number[]) => ({ left: `${(point[0] ?? 0) / 360 * 100}%`, top: `${(point[1] ?? 0) / 400 * 100}%` });

export function InterestMindMap({ groups, active, setActive, unexplored, sourceId, setSourceId }: {
  groups: Group[]; active: string | null; setActive: (name: string | null) => void; unexplored: boolean;
  sourceId: string | null; setSourceId: (id: string | null) => void;
}) {
  const { t, language } = useLanguage();
  const selected = groups.find(group => group.name === active);
  const branches = groups.flatMap((group, index) => {
    const position = positions[index];
    if (!position || (!unexplored && !group.weight)) return [];
    const values = unexplored ? group.values : group.selected;
    const leaves = [...group.events.map(event => ({ label: t(event.event_title), event })), ...values.map(value => ({ label: t(value), event: null as ReflectionRow | null }))].slice(0, 2);
    return [{ group, position, leaves }];
  });
  return <>
    <div className="relative mx-auto aspect-[360/400] w-full max-w-[420px] rounded-lg bg-map-surface text-map-ink" aria-label={t("Your interest map")}>
      <svg viewBox="0 0 360 400" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full fill-none">
        {branches.map(({ group, position, leaves }) => <g key={group.name} className={tones[group.tone].line} strokeLinecap="round">
          <path d={`M 180 205 L ${position.node.join(" ")}`} strokeWidth={active === group.name ? 4 : 2.5} />
          {leaves.map((leaf, index) => <path key={leaf.label} d={`M ${position.node.join(" ")} L ${position.leaves[index]?.join(" ")}`} strokeWidth="1.2" />)}
        </g>)}
      </svg>
      <div style={location([180, 205])} className="absolute flex h-9 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-map-center text-map-center-foreground"><strong className="text-xs">{t("You")}</strong></div>
      {branches.map(({ group, position, leaves }) => <div key={group.name}>
        <Button variant="ghost" aria-pressed={active === group.name} onClick={() => { setActive(active === group.name ? null : group.name); setSourceId(null); }} style={location(position.node)} className={`absolute h-auto min-h-7 w-[78px] -translate-x-1/2 -translate-y-1/2 whitespace-normal rounded-full border-2 px-2 py-1 text-[10px] font-semibold leading-tight text-map-ink hover:bg-map-surface ${tones[group.tone].node} ${!group.weight ? "border-dashed" : ""} ${active === group.name ? "ring-2 ring-map-ink/20 ring-offset-2 ring-offset-map-surface" : ""}`}>
          {t(group.name)}{group.events.length > 0 && <span className={`absolute -right-1 -top-2 flex size-4 items-center justify-center rounded-full text-[9px] ${tones[group.tone].dot}`}>{group.events.length}</span>}
        </Button>
        {leaves.map((leaf, index) => {
          const end = position.leaves[index];
          if (!end) return null;
          return <Button key={leaf.label} variant="ghost" aria-label={leaf.label} title={leaf.label} aria-expanded={leaf.event ? sourceId === leaf.event.id : undefined} onClick={() => { setActive(group.name); setSourceId(leaf.event ? sourceId === leaf.event.id ? null : leaf.event.id : null); }} style={location(end)} className="absolute flex h-[54px] w-[74px] -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-md px-1 py-1 text-map-ink hover:bg-map-ink/5">
            <span className="line-clamp-2 w-full whitespace-normal text-center text-[9px] font-medium leading-tight">{leaf.label}</span>
            <span className={`flex size-3 shrink-0 items-center justify-center rounded-full ${tones[group.tone].dot}`}><span className="size-1 rounded-full bg-map-surface" /></span>
            {leaf.event && <span className="text-[8px] leading-none">{leaf.event.rating}/5</span>}
          </Button>;
        })}
      </div>)}
    </div>
    {selected && <div className="mt-4 border-l-2 border-border pl-4">
      <h4 className="mb-2 text-sm font-semibold">{t(selected.name)}</h4>
      <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">{(unexplored ? selected.values : selected.selected).map(value => <span key={value}>{t(value)}</span>)}</div>
      {selected.events.map(event => <div key={event.id} className="py-1"><Button variant="ghost" aria-expanded={sourceId === event.id} onClick={() => setSourceId(sourceId === event.id ? null : event.id)} className="h-auto min-h-11 w-full justify-start gap-2 whitespace-normal rounded-md px-0 py-2 text-left text-xs"><Star className="size-3 shrink-0 text-primary" /><span className="min-w-0">{t(event.event_title)}<span className="mt-1 block text-[10px] text-muted-foreground">{event.rating}/5 · {new Date(event.created_at).toLocaleDateString(language)}</span></span><ChevronRight className="ml-auto size-3 shrink-0" /></Button>{sourceId === event.id && <ReflectionSource reflection={event} />}</div>)}
    </div>}
  </>;
}
