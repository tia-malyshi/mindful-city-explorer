import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home, Map as MapIcon, CalendarDays, Sparkles, Smile, Check, X, Camera, Mic, MessageCircle,
  MapPin, Clock, ThumbsUp, ThumbsDown, Play, Plus, Minus, Search, SlidersHorizontal, ChevronLeft,
  ChevronRight, ChevronsRight, List, Grid3x3, Trees, Music, Dumbbell, Users, Waves, Lightbulb, RefreshCw,
} from "lucide-react";
import park from "@/assets/park.jpg";
import oldtown from "@/assets/oldtown.jpg";
import pool from "@/assets/pool.jpg";
import river from "@/assets/river.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kompas — explore Warsaw, feel better" },
      { name: "description", content: "Mobile prototype: personalised Warsaw activities, small challenges and a monthly story of your city life." },
      { property: "og:title", content: "Kompas — explore Warsaw, feel better" },
      { property: "og:description", content: "Mental-health friendly city exploration app prototype built on Warsaw Open Data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tab = "onboard" | "feed" | "all" | "calendar" | "quest" | "feedback" | "mymap" | "journal" | "insights";

type Ev = { id: number; t: string; c: Cat; src: string; day: number; time: string; district: string; km: number; aud: "Adults" | "Family" | "All ages"; free: boolean; img: string };
type Cat = "Nature" | "Sport" | "Culture" | "Social";
const catColor: Record<Cat, string> = { Nature: "bg-sage", Sport: "bg-sky", Culture: "bg-rose", Social: "bg-sun" };

const events: Ev[] = [
  { id: 1, t: "Sunset walk, Pole Mokotowskie", c: "Nature", src: "Open Data", day: 19, time: "18:30", district: "Mokotów", km: 1.2, aud: "All ages", free: true, img: park },
  { id: 2, t: "Open swim, Warszawianka", c: "Sport", src: "Open Data", day: 20, time: "07:00", district: "Mokotów", km: 2.8, aud: "Adults", free: false, img: pool },
  { id: 3, t: "Jazz on Old Town square", c: "Culture", src: "Facebook", day: 24, time: "20:00", district: "Śródmieście", km: 4.5, aud: "Adults", free: true, img: oldtown },
  { id: 4, t: "Run club, Wisła boulevards", c: "Sport", src: "Facebook", day: 25, time: "08:00", district: "Powiśle", km: 3.4, aud: "All ages", free: true, img: river },
  { id: 5, t: "Family picnic, Ogród Saski", c: "Social", src: "Facebook", day: 25, time: "13:00", district: "Śródmieście", km: 3.9, aud: "Family", free: true, img: park },
  { id: 6, t: "Board games night, Praga", c: "Social", src: "Facebook", day: 22, time: "19:00", district: "Praga", km: 5.6, aud: "Adults", free: false, img: oldtown },
  { id: 7, t: "Kids science day, Kopernik", c: "Culture", src: "Open Data", day: 27, time: "10:00", district: "Powiśle", km: 3.6, aud: "Family", free: false, img: river },
  { id: 8, t: "Outdoor gym, Skaryszewski", c: "Sport", src: "Open Data", day: 21, time: "Any", district: "Praga-Płd.", km: 5.1, aud: "All ages", free: true, img: park },
  { id: 9, t: "Library meetup: Polish for newcomers", c: "Social", src: "Open Data", day: 23, time: "17:30", district: "Wola", km: 4.0, aud: "Adults", free: true, img: oldtown },
];

type Filters = { cats: Cat[]; aud: string; free: boolean; maxKm: number };
const defaultFilters: Filters = { cats: [], aud: "Any", free: false, maxKm: 10 };
const applyFilters = (f: Filters, q = "") =>
  events.filter((e) => (f.cats.length === 0 || f.cats.includes(e.c)) && (f.aud === "Any" || e.aud === f.aud || e.aud === "All ages") && (!f.free || e.free) && e.km <= f.maxKm && e.t.toLowerCase().includes(q.toLowerCase()));

function Index() {
  const [tab, setTab] = useState<Tab>("onboard");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [planned, setPlanned] = useState<number[]>([1, 3]);
  const toggle = (id: number) => setPlanned((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const ctx = { filters, setFilters, planned, toggle, setTab };

  const labels: [Tab, string][] = [["onboard", "Onboarding"], ["feed", "1 · Warszawa"], ["all", "All events + filters"], ["calendar", "2 · Calendar"], ["quest", "3–4 · Quest"], ["feedback", "5 · Feedback"], ["insights", "6 · Insights + interests"], ["journal", "Monthly story"]];

  return (
    <main className="min-h-screen px-6 py-10 lg:py-14">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_390px_1fr]">
        <section className="space-y-6 lg:pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Warsaw Open Data · prototype</p>
          <h1 className="font-display text-7xl font-black leading-none tracking-tight">Kompas</h1>
          <p className="text-muted-foreground">Small city adventures, tiny challenges and a monthly story that shows how rich your life is.</p>
          <nav className="flex flex-wrap gap-2">
            {labels.map(([t, l]) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full border px-4 py-1.5 text-sm transition ${tab === t ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{l}</button>
            ))}
          </nav>
        </section>
        <Phone tab={tab} ctx={ctx} />
        <Hints />
      </div>
    </main>
  );
}

type Ctx = { filters: Filters; setFilters: (f: Filters) => void; planned: number[]; toggle: (id: number) => void; setTab: (t: Tab) => void };

function Phone({ tab, ctx }: { tab: Tab; ctx: Ctx }) {
  const full = tab === "onboard";
  return (
    <div className="mx-auto w-[375px] rounded-[3.2rem] border-[10px] border-ink bg-background shadow-phone ring-1 ring-border">
      <div className="relative h-[780px] overflow-hidden rounded-[2.6rem]">
        {!full && <div className="flex justify-between px-7 pt-3 text-xs font-bold"><span>9:41</span><span>5G ▮▮▮</span></div>}
        <div className={`no-scrollbar h-full overflow-y-auto ${full ? "" : "px-5 pb-28 pt-3"}`}>
          {tab === "onboard" && <Onboarding done={() => ctx.setTab("feed")} />}
          {tab === "feed" && <Feed ctx={ctx} />}
          {tab === "all" && <AllEvents ctx={ctx} />}
          {tab === "calendar" && <CalendarScreen ctx={ctx} />}
          {tab === "quest" && <Quest />}
          {tab === "feedback" && <Feedback />}
          {tab === "mymap" && <Insights />}
          {tab === "journal" && <Journal />}
          {tab === "insights" && <Insights />}
        </div>
        {!full && (
          <div className="absolute inset-x-4 bottom-5 flex justify-between rounded-full border bg-card/90 p-1.5 backdrop-blur">
            {([["feed", Home], ["calendar", CalendarDays], ["quest", Sparkles], ["insights", Lightbulb]] as const).map(([t, I]) => {
              const on = tab === t || (t === "feed" && tab === "all") || (t === "quest" && tab === "feedback") || (t === "insights" && tab === "mymap");
              return (
                <button key={t} onClick={() => ctx.setTab(t)} className={`flex h-12 flex-1 items-center justify-center rounded-full transition ${on ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <I className="size-5" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Onboarding({ done }: { done: () => void }) {
  const [step, setStep] = useState(-1);
  const [picked, setPicked] = useState<string[]>([]);
  const steps = [
    { q: "What interests you?", hint: "Choose as many as you like.", opts: ["Nature & walks", "Sports & fitness", "Art & museums", "Music & concerts", "Food & cafés", "Books & writing", "Board games", "Photography", "Dance", "Crafts & workshops", "Mindfulness", "Volunteering", "History & architecture", "Science & technology"] },
    { q: "What do you want more of?", hint: "Your goal for the next weeks.", opts: ["Calm", "Movement", "New people", "Culture", "Nature", "Confidence", "Routine", "Creativity"] },
    { q: "How are you feeling lately?", hint: "Only you see this. It helps us pace ideas.", opts: ["Great", "Okay", "A bit low", "Stressed", "Lonely", "Tired"] },
    { q: "How social do you feel?", hint: "We'll match the crowd size.", opts: ["Quiet & solo", "Small groups", "Big events are fine", "Surprise me"] },
    { q: "Who's coming with you?", hint: "Pick adult or family events.", opts: ["Just me", "Partner", "Friends", "Kids — family events", "My dog"] },
    { q: "When are you free?", hint: "Choose all that fit.", opts: ["Weekday mornings", "Weekday evenings", "Weekends", "Lunch breaks", "Anytime"] },
    { q: "How many ideas per week?", hint: "Start small — you can change it later.", opts: ["1–2", "3–4", "5+"] },
    { q: "What's your budget?", hint: "Many city events are free.", opts: ["Free only", "Up to 30 zł", "Up to 100 zł", "No limit"] },
    { q: "Where do you live?", hint: "To show what's near you.", opts: ["Śródmieście", "Mokotów", "Wola", "Praga", "Ursynów", "Bielany", "Other"] },
    { q: "How far are you up for?", hint: "By foot, bike or public transport.", opts: ["My neighbourhood", "Up to 30 min", "All of Warsaw"] },
    { q: "Anything we should know?", hint: "Optional — helps pick fitting places.", opts: ["Step-free access", "Quiet places", "Polish not needed", "No alcohol", "None"] },
  ];
  if (step < 0)
    return (
      <div className="relative h-full">
        <img src={park} alt="Warsaw park at sunset" className="absolute inset-0 size-full object-cover" />
        <div className="scrim absolute inset-0" />
        <div className="absolute inset-x-6 bottom-10 space-y-6">
          <div>
            <p className="text-lg">Plan your</p>
            <h2 className="font-display text-5xl font-black leading-[0.95]">Day in Warszawa</h2>
          </div>
          <button onClick={() => setStep(0)} className="flex w-full items-center gap-3 rounded-full bg-card/80 p-2 backdrop-blur">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><ChevronsRight className="size-5" /></span>
            <span className="flex-1 text-center font-bold">Start exploring</span>
          </button>
        </div>
      </div>
    );
  const s = steps[step]!;
  const tog = (o: string) => setPicked((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));
  return (
    <div className="flex h-full flex-col px-6 pb-10 pt-14">
      <div className="mb-6 flex gap-1">{steps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />)}</div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <button onClick={() => setStep(step - 1)}>‹ Back</button>
        <span>Question {step + 1} / {steps.length}</span>
      </div>
      <h2 className="mt-4 font-display text-4xl font-black leading-tight">{s.q}</h2>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">{s.hint}</p>
      <div className="-mx-1 flex flex-1 flex-wrap content-start gap-2 overflow-y-auto px-1 pb-4">
        {s.opts.map((o) => <button key={o} onClick={() => tog(o)} className={`rounded-full border px-4 py-2.5 text-sm font-medium ${picked.includes(o) ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{o}</button>)}
      </div>
      <button onClick={() => (step < steps.length - 1 ? setStep(step + 1) : done())} className="mt-4 rounded-full bg-primary py-4 font-bold text-primary-foreground">
        {step < steps.length - 1 ? "Continue" : "Show my ideas"}
      </button>
    </div>
  );
}

function FilterSheet({ ctx, close }: { ctx: Ctx; close: () => void }) {
  const [f, setF] = useState(ctx.filters);
  const cats: Cat[] = ["Nature", "Sport", "Culture", "Social"];
  const chip = (on: boolean) => `rounded-full border px-3 py-1.5 text-xs font-medium ${on ? "border-primary bg-primary text-primary-foreground" : "bg-muted"}`;
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-ink/70">
      <div className="space-y-5 rounded-t-[2rem] border-t bg-card p-6 pb-10">
        <div className="flex items-center justify-between"><h3 className="font-display text-2xl font-black">Filters</h3><button onClick={close}><X className="size-5" /></button></div>
        <div><p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Category</p>
          <div className="flex flex-wrap gap-2">{cats.map((c) => <button key={c} className={chip(f.cats.includes(c))} onClick={() => setF({ ...f, cats: f.cats.includes(c) ? f.cats.filter((x) => x !== c) : [...f.cats, c] })}>{c}</button>)}</div></div>
        <div><p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">For</p>
          <div className="flex gap-2">{["Any", "Adults", "Family"].map((a) => <button key={a} className={chip(f.aud === a)} onClick={() => setF({ ...f, aud: a })}>{a}</button>)}</div></div>
        <div><p className="mb-2 flex justify-between text-xs uppercase tracking-wider text-muted-foreground"><span>Distance</span><span className="text-foreground">up to {f.maxKm} km</span></p>
          <input type="range" min={1} max={10} value={f.maxKm} onChange={(e) => setF({ ...f, maxKm: +e.target.value })} className="w-full accent-primary" /></div>
        <label className="flex items-center justify-between text-sm"><span>Free only</span><input type="checkbox" checked={f.free} onChange={(e) => setF({ ...f, free: e.target.checked })} className="size-5 accent-primary" /></label>
        <div className="flex gap-2">
          <button onClick={() => setF(defaultFilters)} className="flex-1 rounded-full border py-3 text-sm">Reset</button>
          <button onClick={() => { ctx.setFilters(f); close(); }} className="flex-[2] rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground">Show {applyFilters(f).length} events</button>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ q, setQ, onFilter, count }: { q: string; setQ: (s: string) => void; onFilter: () => void; count: number }) {
  return (
    <div className="flex gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-full bg-muted px-4 py-3">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, places…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
      <button onClick={onFilter} className="relative flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <SlidersHorizontal className="size-5" />
        {count > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-rose text-[10px] font-bold text-foreground">{count}</span>}
      </button>
    </div>
  );
}

const activeCount = (f: Filters) => f.cats.length + (f.aud !== "Any" ? 1 : 0) + (f.free ? 1 : 0) + (f.maxKm < 10 ? 1 : 0);

function Feed({ ctx }: { ctx: Ctx }) {
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState(false);
  const [tabSel, setTabSel] = useState("For you");
  const list = applyFilters(ctx.filters, q);
  return (
    <div className="space-y-5">
      <div className="pt-2">
        <p className="text-lg text-muted-foreground">Choose your</p>
        <h2 className="font-display text-5xl font-black leading-none">Warszawa</h2>
      </div>
      <SearchBar q={q} setQ={setQ} onFilter={() => setSheet(true)} count={activeCount(ctx.filters)} />
      <div className="flex gap-5 text-sm">
        {["For you", "This weekend", "Nearby"].map((t) => <button key={t} onClick={() => setTabSel(t)} className={tabSel === t ? "border-b-2 border-primary pb-1 font-bold" : "pb-1 text-muted-foreground"}>{t}</button>)}
      </div>
      <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5">
        {list.slice(0, 5).map((e) => (
          <div key={e.id} className="relative h-72 w-56 shrink-0 snap-start overflow-hidden rounded-3xl">
            <img src={e.img} alt={e.t} loading="lazy" width={816} height={816} className="absolute inset-0 size-full object-cover" />
            <div className="scrim absolute inset-0" />
            <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-ink ${catColor[e.c]}`}>{e.c}</span>
            <button onClick={() => ctx.toggle(e.id)} className={`absolute right-3 top-3 flex size-9 items-center justify-center rounded-full ${ctx.planned.includes(e.id) ? "bg-primary text-primary-foreground" : "bg-card/70 backdrop-blur"}`}>
              {ctx.planned.includes(e.id) ? <Check className="size-4" /> : <Plus className="size-4" />}
            </button>
            <div className="absolute inset-x-4 bottom-4">
              <p className="font-display text-lg font-extrabold leading-tight">{e.t}</p>
              <p className="mt-1 text-xs opacity-80">Oct {e.day} · {e.time} · {e.km} km</p>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground">No events match your filters.</p>}
      </div>
      <button onClick={() => ctx.setTab("all")} className="flex w-full items-center justify-between rounded-2xl bg-card p-4">
        <span className="flex items-center gap-2 text-sm font-bold"><List className="size-4 text-primary" />See all {list.length} events</span><ChevronRight className="size-4" />
      </button>
      {sheet && <FilterSheet ctx={ctx} close={() => setSheet(false)} />}
    </div>
  );
}

function AllEvents({ ctx }: { ctx: Ctx }) {
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState(false);
  const list = applyFilters(ctx.filters, q).sort((a, b) => a.day - b.day);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => ctx.setTab("feed")} className="flex size-10 items-center justify-center rounded-full bg-muted"><ChevronLeft className="size-5" /></button>
        <h2 className="font-display text-3xl font-black">All events</h2>
      </div>
      <SearchBar q={q} setQ={setQ} onFilter={() => setSheet(true)} count={activeCount(ctx.filters)} />
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 text-xs">
        {(["Nature", "Sport", "Culture", "Social"] as Cat[]).map((c) => {
          const on = ctx.filters.cats.includes(c);
          return <button key={c} onClick={() => ctx.setFilters({ ...ctx.filters, cats: on ? ctx.filters.cats.filter((x) => x !== c) : [...ctx.filters.cats, c] })} className={`shrink-0 rounded-full px-3 py-1.5 font-bold ${on ? `${catColor[c]} text-ink` : "bg-muted text-muted-foreground"}`}>{c}</button>;
        })}
      </div>
      <div className="-space-y-3">
        {list.map((e) => (
          <div key={e.id} className={`relative flex items-center gap-3 rounded-3xl p-4 pb-6 text-ink shadow-lg ${catColor[e.c]}`}>
            <img src={e.img} alt="" loading="lazy" className="size-12 rounded-2xl object-cover" />
            <div className="flex-1">
              <p className="font-bold leading-tight">{e.t}</p>
              <p className="text-xs opacity-75">Oct {e.day} · {e.time} · {e.district} · {e.aud}{e.free ? " · free" : ""}</p>
            </div>
            <button onClick={() => ctx.toggle(e.id)} className="flex size-9 items-center justify-center rounded-full bg-ink/20">
              {ctx.planned.includes(e.id) ? <Check className="size-4" /> : <Plus className="size-4" />}
            </button>
          </div>
        ))}
      </div>
      {sheet && <FilterSheet ctx={ctx} close={() => setSheet(false)} />}
    </div>
  );
}

function CalendarScreen({ ctx }: { ctx: Ctx }) {
  const [view, setView] = useState<"week" | "month">("month");
  const [sel, setSel] = useState(25);
  const firstOffset = 3; // Oct 1 2026 is Thursday
  const daysIn = 31;
  const byDay = (d: number) => events.filter((e) => e.day === d);
  const weekStart = sel - ((sel + firstOffset - 1) % 7);
  const days = view === "month" ? Array.from({ length: daysIn }, (_, i) => i + 1) : Array.from({ length: 7 }, (_, i) => weekStart + i).filter((d) => d >= 1 && d <= daysIn);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h2 className="font-display text-4xl font-black">October</h2>
        <div className="flex rounded-full bg-muted p-1">
          {([["week", List], ["month", Grid3x3]] as const).map(([v, I]) => <button key={v} onClick={() => setView(v)} className={`flex size-9 items-center justify-center rounded-full ${view === v ? "bg-primary text-primary-foreground" : ""}`}><I className="size-4" /></button>)}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {view === "month" && Array.from({ length: firstOffset }).map((_, i) => <div key={"e" + i} />)}
        {days.map((d) => {
          const evs = byDay(d);
          const mine = evs.some((e) => ctx.planned.includes(e.id));
          return (
            <button key={d} onClick={() => setSel(d)} className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm ${sel === d ? "bg-primary font-bold text-primary-foreground" : mine ? "bg-secondary" : "bg-card"}`}>
              {d}
              <span className="mt-0.5 flex gap-0.5">{evs.slice(0, 3).map((e) => <span key={e.id} className={`size-1 rounded-full ${catColor[e.c]}`} />)}</span>
            </button>
          );
        })}
      </div>
      <p className="pt-2 text-xs uppercase tracking-wider text-muted-foreground">Oct {sel} · {byDay(sel).length} events</p>
      {byDay(sel).map((e) => {
        const on = ctx.planned.includes(e.id);
        return (
          <div key={e.id} className={`flex items-center gap-3 rounded-2xl p-3 ${on ? "bg-secondary" : "bg-card"}`}>
            <span className={`h-10 w-1 rounded-full ${catColor[e.c]}`} />
            <div className="flex-1"><p className="text-sm font-bold">{e.t}</p><p className="text-xs text-muted-foreground">{e.time} · {e.district}</p></div>
            <button onClick={() => ctx.toggle(e.id)} className={`flex size-9 items-center justify-center rounded-full ${on ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{on ? <Minus className="size-4" /> : <Plus className="size-4" />}</button>
          </div>
        );
      })}
      {byDay(sel).length === 0 && <p className="rounded-2xl bg-card p-4 text-sm text-muted-foreground">Free day — want a 10-minute idea?</p>}
    </div>
  );
}

const tasks = [{ id: "photo", label: "Take 3 pictures", icon: Camera }, { id: "voice", label: "Reflect in a voice note", icon: Mic }, { id: "talk", label: "Talk to a stranger", icon: MessageCircle }];

function Quest() {
  const [idx, setIdx] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [chosen, setChosen] = useState<string[]>(["photo"]);
  const [review, setReview] = useState<null | "up" | "down">(null);
  const e = events[idx % events.length]!;
  if (accepted)
    return (
      <div className="space-y-5 pt-2">
        <p className="text-xs uppercase tracking-wider text-primary">Your quest</p>
        <h2 className="font-display text-3xl font-black leading-tight">{e.t}</h2>
        <div className="space-y-2">
          {tasks.map((t) => {
            const on = chosen.includes(t.id);
            return (
              <button key={t.id} onClick={() => setChosen((c) => (on ? c.filter((x) => x !== t.id) : [...c, t.id]))} className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left ${on ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                <t.icon className="size-5" /><span className="flex-1 text-sm font-medium">{t.label}</span>{on && <Check className="size-4" />}
              </button>
            );
          })}
        </div>
        <div className="rounded-3xl bg-card p-4">
          <p className="mb-3 text-sm font-bold">After: how was it?</p>
          <div className="flex gap-2">
            <button onClick={() => setReview("up")} className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm ${review === "up" ? "bg-sage text-ink" : "bg-muted"}`}><ThumbsUp className="size-4" />Good</button>
            <button onClick={() => setReview("down")} className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm ${review === "down" ? "bg-rose text-ink" : "bg-muted"}`}><ThumbsDown className="size-4" />Not for me</button>
          </div>
          {review && <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted p-3 text-sm"><span>{review === "up" ? "More like this?" : "Fewer like this?"}</span><button onClick={() => { setAccepted(false); setReview(null); setIdx(idx + 1); }} className="font-bold text-primary">Yes</button></div>}
        </div>
      </div>
    );
  return (
    <div className="space-y-5 pt-2">
      <div><p className="text-muted-foreground">Dzień dobry, Ola</p><h2 className="font-display text-4xl font-black">Today's idea</h2></div>
      <div className="relative h-[420px] overflow-hidden rounded-[2rem]">
        <img src={e.img} alt={e.t} className="absolute inset-0 size-full object-cover" />
        <div className="scrim absolute inset-0" />
        <div className="absolute inset-x-5 bottom-5 space-y-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold text-ink ${catColor[e.c]}`}>{e.c} · {e.aud}</span>
          <h3 className="font-display text-2xl font-black leading-tight">{e.t}</h3>
          <div className="flex gap-4 text-xs opacity-80"><span className="flex items-center gap-1"><Clock className="size-3" />Oct {e.day}, {e.time}</span><span className="flex items-center gap-1"><MapPin className="size-3" />{e.km} km</span></div>
          <p className="flex gap-2 text-xs opacity-80"><Sparkles className="size-3 shrink-0 text-primary" />You want more calm and liked last week's park walk.</p>
        </div>
      </div>
      <div className="flex justify-center gap-6">
        <button onClick={() => setIdx(idx + 1)} className="flex size-16 items-center justify-center rounded-full bg-muted"><X className="size-6" /></button>
        <button onClick={() => setAccepted(true)} className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-6" /></button>
      </div>
    </div>
  );
}

function Feedback() {
  const [mood, setMood] = useState<number | null>(null);
  const [rec, setRec] = useState(false);
  return (
    <div className="space-y-5 pt-2">
      <div className="relative h-40 overflow-hidden rounded-3xl"><img src={oldtown} alt="" className="size-full object-cover" /><div className="scrim absolute inset-0" /><p className="absolute bottom-3 left-4 text-sm font-bold">Jazz on Old Town square · just now</p></div>
      <h2 className="font-display text-4xl font-black">How was it?</h2>
      <div className="flex justify-between">{["😞", "😐", "🙂", "😄", "🤩"].map((m, i) => <button key={m} onClick={() => setMood(i)} className={`flex size-14 items-center justify-center rounded-full text-2xl ${mood === i ? "bg-primary" : "bg-card"}`}>{m}</button>)}</div>
      <div className="space-y-2">{["What surprised you?", "Did you meet anyone?", "Would you go again?"].map((q) => <div key={q} className="rounded-2xl bg-card p-4 text-sm">{q}</div>)}</div>
      <button onClick={() => setRec(!rec)} className={`flex w-full items-center justify-center gap-3 rounded-full py-5 font-bold ${rec ? "bg-rose text-ink" : "bg-primary text-primary-foreground"}`}>
        {rec ? <Mic className="size-5 animate-pulse" /> : <Play className="size-5" />}{rec ? "Recording… tap to stop" : "Answer with your voice"}
      </button>
    </div>
  );
}

const interests = [
  { n: "Nature", v: 30, c: "stroke-sage", bg: "bg-sage", I: Trees },
  { n: "Culture", v: 22, c: "stroke-rose", bg: "bg-rose", I: Music },
  { n: "Sport", v: 18, c: "stroke-sky", bg: "bg-sky", I: Dumbbell },
  { n: "Social", v: 14, c: "stroke-sun", bg: "bg-sun", I: Users },
  { n: "Water", v: 9, c: "stroke-accent", bg: "bg-accent", I: Waves },
  { n: "Learning", v: 7, c: "stroke-violet", bg: "bg-violet", I: Lightbulb },
];

function MyMap() {
  const [sel, setSel] = useState<string | null>(null);
  const total = interests.reduce((t, i) => t + i.v, 0);
  const R = 120, C = 150, gap = 19;
  let ang = -90;
  const pt = (deg: number, r = R) => [C + r * Math.cos((deg * Math.PI) / 180), C + r * Math.sin((deg * Math.PI) / 180)] as const;
  const segs = interests.map((it) => {
    const span = (it.v / total) * 360 - gap;
    const s0 = ang + gap / 2, s1 = s0 + span;
    ang += (it.v / total) * 360;
    const [x0, y0] = pt(s0), [x1, y1] = pt(s1);
    const mid = pt((s0 + s1) / 2);
    return { ...it, d: `M ${x0} ${y0} A ${R} ${R} 0 ${span > 180 ? 1 : 0} 1 ${x1} ${y1}`, mid };
  });
  const active = interests.find((i) => i.n === sel);
  return (
    <div className="space-y-5 pt-2">
      <h2 className="font-display text-4xl font-black">Insights</h2>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Your interest map</p>
      <div className="relative mx-auto size-[300px]">
        <svg viewBox="0 0 300 300" className="size-full">
          {segs.map((s) => (
            <path key={s.n} d={s.d} onClick={() => setSel(s.n === sel ? null : s.n)} className={`${s.c} cursor-pointer fill-none transition-opacity ${sel && sel !== s.n ? "opacity-30" : ""}`} strokeWidth={sel === s.n ? 44 : 36} strokeLinecap="round" />
          ))}
        </svg>
        {segs.map((s) => (
          <span key={s.n} style={{ left: s.mid[0], top: s.mid[1] }} className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 text-ink"><s.I className="size-5" /></span>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-display text-6xl font-black">{active ? `${Math.round((active.v / total) * 100)}%` : "6"}</p>
          <p className="text-xs text-muted-foreground">{active ? active.n : "interests discovered"}</p>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Find more like this</button>
        <button className="rounded-full bg-muted px-4 py-2 text-sm">Try a wildcard</button>
      </div>
      <div className="space-y-3 rounded-3xl bg-card p-4">
        {interests.map((i) => (
          <button key={i.n} onClick={() => setSel(i.n === sel ? null : i.n)} className="flex w-full items-center gap-3 text-left">
            <span className={`flex size-9 items-center justify-center rounded-full text-ink ${i.bg}`}><i.I className="size-4" /></span>
            <div className="flex-1"><p className="text-sm font-bold">{i.n}</p><div className="mt-1 h-1.5 rounded-full bg-muted"><div className={`h-1.5 rounded-full ${i.bg}`} style={{ width: `${(i.v / 30) * 100}%` }} /></div></div>
            <b className="font-display">{Math.round((i.v / total) * 100)}%</b>
          </button>
        ))}
      </div>
    </div>
  );
}

function Journal() {
  const months = [["October", "12 moments", river], ["September", "9 moments", park], ["August", "15 moments", oldtown]] as const;
  return (
    <div className="space-y-3 pt-2">
      <h2 className="font-display text-4xl font-black">2026</h2>
      {months.map(([m, n, img]) => (
        <div key={m} className="relative h-48 overflow-hidden rounded-3xl">
          <img src={img} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
          <div className="scrim absolute inset-0" />
          <span className="absolute left-4 top-4 rounded-full border border-foreground/40 px-3 py-1 text-xs backdrop-blur">{n}</span>
          <p className="absolute -bottom-3 left-3 font-display text-6xl font-black tracking-tight opacity-90">{m}</p>
        </div>
      ))}
    </div>
  );
}

function Hints() {
  const hints = [
    ["One idea, not a feed", "On Quest, a single card lowers decision fatigue for anxious or low-energy users."],
    ["Energy check-in", "Ask “how much energy today?” and scale ideas from a 10-min bench sit to a meetup."],
    ["Open data", "api.um.warszawa.pl: parks, sports facilities, pools, libraries, events; ZTM for travel time."],
    ["Bring a buddy", "Invite a friend or join others on the same quest — community forms here."],
    ["80 / 20 mix", "80% matches, 20% wildcards so the profile doesn't trap people in a bubble."],
    ["Weather-aware", "Swap outdoor ideas for indoor ones when it rains."],
    ["Privacy & care", "Photos/voice on-device by default; link 116 123 support line in settings."],
  ];
  return (
    <section className="space-y-3 lg:pt-6">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Concept hints</p>
      {hints.map(([t, d]) => <div key={t} className="rounded-2xl border bg-card p-4"><p className="font-display font-extrabold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>)}
    </section>
  );
}

const weeks = [
  { label: "Oct 12 – 18", sub: "This week", stats: [["4", "events"], ["4.3", "avg rating"], ["25 zł", "spent"], ["3", "districts"]], d: [["Śródmieście", 2], ["Praga-Północ", 1], ["Mokotów", 1]] as [string, number][],
    notes: ["Mix: Sport ×2, Nature and Music.", "Mostly mornings (2 of 4).", "Out on Mon, Wed, Thu, Fri — about 8 h total.", "You talked to 2 new people. 👋"] },
  { label: "Oct 5 – 11", sub: "Last week", stats: [["2", "events"], ["3.5", "avg rating"], ["0 zł", "spent"], ["1", "districts"]], d: [["Mokotów", 2]] as [string, number][],
    notes: ["Only Nature this week.", "Both in the evening.", "Quieter week — that's okay."] },
];

function Insights() {
  const [w, setW] = useState(0);
  const wk = weeks[w]!;
  const max = Math.max(...wk.d.map(([, n]) => n));
  return (
    <div className="space-y-4 pt-2">
      <MyMap />
      <p className="pt-4 text-xs uppercase tracking-wider text-muted-foreground">Weekly review</p>
      <p className="text-sm text-muted-foreground">Your weekly review: where you went and what to try next, built from your visits, ratings and notes.</p>
      <div className="flex gap-2 rounded-2xl border border-primary/30 bg-primary/10 p-3 text-xs">
        <Sparkles className="size-4 shrink-0 text-primary" />
        <p><b>How it works.</b> Simple counts on your phone — it doesn't judge your mood or wellbeing.</p>
      </div>
      <div className="flex items-center justify-between">
        <button disabled={w === weeks.length - 1} onClick={() => setW(w + 1)} className="flex size-10 items-center justify-center rounded-full bg-muted disabled:opacity-30"><ChevronLeft className="size-5" /></button>
        <div className="text-center"><p className="font-bold">{wk.label}</p><p className="text-xs text-primary">{wk.sub}</p></div>
        <button disabled={w === 0} onClick={() => setW(w - 1)} className="flex size-10 items-center justify-center rounded-full bg-muted disabled:opacity-30"><ChevronRight className="size-5" /></button>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {wk.stats.map(([a, b]) => <div key={b} className="rounded-2xl bg-card p-2.5"><b className="block font-display text-xl">{a}</b><span className="text-[9px] uppercase tracking-wider text-muted-foreground">{b}</span></div>)}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Built from {wk.stats[0]![0]} visits</span><button className="flex items-center gap-1 font-bold text-primary"><RefreshCw className="size-3" />Refresh</button></div>
      <div className="space-y-3 rounded-3xl bg-card p-4">
        <div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><MapPin className="size-4" /></span><h3 className="font-display text-lg font-black">Where you went</h3></div>
        {wk.d.map(([n, c]) => (
          <div key={n} className="flex items-center gap-2 text-xs">
            <span className="w-24 text-muted-foreground">{n}</span>
            <div className="h-2 flex-1 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(c / max) * 100}%` }} /></div>
            <b className="w-3">{c}</b>
          </div>
        ))}
        <ul className="list-disc space-y-1 pl-4 text-sm">{wk.notes.map((n) => <li key={n}>{n}</li>)}</ul>
      </div>
      <div className="space-y-2 rounded-3xl bg-card p-4">
        <div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-sun text-ink"><Lightbulb className="size-4" /></span><h3 className="font-display text-lg font-black">Try next</h3></div>
        {["You haven't been to Wola yet — library meetup Thu 17:30", "Loved jazz? Concert in Łazienki on Sunday", "Rainy Saturday — try the pool instead of a run"].map((t) => <p key={t} className="rounded-2xl bg-muted p-3 text-sm">{t}</p>)}
      </div>
    </div>
  );
}
