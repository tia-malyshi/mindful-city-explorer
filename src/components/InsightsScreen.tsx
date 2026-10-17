import { useState } from "react";
import { ChevronLeft, ChevronRight, Lightbulb, MapPin, Sparkles } from "lucide-react";

type Activity = { id: number; day: number; c: string; district: string; free: boolean };

export function InsightsScreen({ activities, onExplore }: { activities: Activity[]; onExplore: () => void }) {
  const [week, setWeek] = useState(19);
  const selected = activities.filter((activity) => activity.day >= week && activity.day < week + 7);
  const districts = [...new Set(selected.map((activity) => activity.district))];
  const categories = ["Nature", "Sport", "Culture", "Social"];
  return (
    <div className="space-y-5 pt-2">
      <header>
        <p className="text-sm text-muted-foreground">Your city, your story</p>
        <h2 className="font-display text-4xl font-black">Insights</h2>
        <p className="mt-3 text-sm text-muted-foreground">A little perspective on your plans and what sparks your curiosity.</p>
      </header>
      <div className="flex gap-3 rounded-2xl bg-primary/10 p-4 text-xs leading-relaxed">
        <Sparkles className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <p><strong>How it works.</strong> This preview summarizes your planned sample activities, not confirmed visits. Ratings, spending and reflections are not tracked yet. Plans reset on refresh.</p>
      </div>
      <div className="flex items-center justify-between">
        <button aria-label="Previous week" disabled={week === 5} onClick={() => setWeek(week - 7)} className="flex size-11 items-center justify-center rounded-full border bg-card disabled:opacity-30"><ChevronLeft className="size-4" /></button>
        <div aria-live="polite" className="text-center"><p className="text-sm font-bold">Oct {week}–{week + 6}, 2026</p><p className="text-xs text-muted-foreground">Weekly overview</p></div>
        <button aria-label="Next week" disabled={week === 26} onClick={() => setWeek(week + 7)} className="flex size-11 items-center justify-center rounded-full border bg-card disabled:opacity-30"><ChevronRight className="size-4" /></button>
      </div>
      <dl className="grid grid-cols-3 gap-2">
        {[[selected.length, "Planned"], [selected.filter((activity) => activity.free).length, "Free ideas"], [districts.length, "Districts"]].map(([value, label]) => <div key={label} className="rounded-2xl border bg-card px-2 py-3 text-center"><dd className="font-display text-2xl font-black">{value}</dd><dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt></div>)}
      </dl>
      <section className="space-y-4 rounded-3xl border bg-card p-5">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold"><MapPin className="size-5 text-primary" />Where you’re headed</h3>
        {districts.length ? districts.map((district) => <div key={district} className="flex items-center justify-between gap-3 text-sm"><span>{district}</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{selected.filter((activity) => activity.district === district).length} planned</span></div>) : <p className="text-sm text-muted-foreground">No plans for this week yet. A small adventure is a good place to start.</p>}
      </section>
      <section className="space-y-4 rounded-3xl border bg-card p-5">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold"><Sparkles className="size-5 text-primary" />Your interest map</h3>
        <p className="text-xs text-muted-foreground">Categories in this week’s plans — a hint of curiosity, not a personality assessment.</p>
        {categories.map((category) => {
          const count = selected.filter((activity) => activity.c === category).length;
          return <div key={category} className="flex items-center gap-3 text-xs"><span className="w-14">{category}</span><div aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${selected.length ? count / selected.length * 100 : 0}%` }} /></div><span className="w-4 text-right font-bold">{count}</span></div>;
        })}
      </section>
      <section className="rounded-3xl bg-muted p-5">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold"><Lightbulb className="size-5 text-primary" />Room to reflect</h3>
        <p className="mt-3 text-sm text-muted-foreground">After an outing, notice what you enjoyed and what you’d try again. Visit-based insights will appear here once attendance and reflections are connected.</p>
      </section>
      <button onClick={onExplore} className="w-full rounded-full bg-primary py-4 text-sm font-bold text-primary-foreground">Find your next adventure</button>
    </div>
  );
}
