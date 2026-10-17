import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home, Map as MapIcon, BookImage, User, Check, X, Camera, Mic, MessageCircle,
  MapPin, Clock, ThumbsUp, ThumbsDown, Sparkles, Users, Baby, Trees, Waves, Dumbbell, Music, ChevronRight, CalendarDays, Smile, Play, Plus, Minus,
} from "lucide-react";

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

type Tab = "onboard" | "feed" | "calendar" | "home" | "feedback" | "mymap" | "map" | "journal" | "profile";

const ideas = [
  { id: 1, title: "Sunset walk in Pole Mokotowskie", district: "Mokotów", time: "Today 18:30", km: 1.2, icon: Trees, tag: "Nature", x: 45, y: 62, audience: "All ages" },
  { id: 2, title: "Open swim at Warszawianka pool", district: "Mokotów", time: "Tomorrow 07:00", km: 2.8, icon: Waves, tag: "Sport", x: 52, y: 72, audience: "Adults" },
  { id: 3, title: "Jazz at Stare Miasto square", district: "Śródmieście", time: "Sat 20:00", km: 4.5, icon: Music, tag: "Culture", x: 55, y: 35, audience: "Adults" },
  { id: 4, title: "Outdoor gym — Park Skaryszewski", district: "Praga-Płd.", time: "Any time", km: 5.1, icon: Dumbbell, tag: "Sport", x: 72, y: 45, audience: "All ages" },
];

const tasks = [
  { id: "photo", label: "Take 3 pictures", icon: Camera },
  { id: "voice", label: "Reflect in a voice note", icon: Mic },
  { id: "talk", label: "Talk to a stranger", icon: MessageCircle },
];

function Index() {
  const [tab, setTab] = useState<Tab>("onboard");
  return (
    <main className="min-h-screen px-6 py-10 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_390px_1fr]">
        <section className="space-y-6 lg:pt-10">
          <p className="text-sm uppercase tracking-widest text-primary">Warsaw Open Data · prototype</p>
          <h1 className="font-display text-6xl leading-none">Kompas</h1>
          <p className="text-muted-foreground">A gentle nudge out of the house. Small city adventures, tiny challenges, and a monthly story that shows how rich your life is.</p>
          <nav className="flex flex-wrap gap-2">
            {(["onboard", "feed", "calendar", "home", "feedback", "mymap", "map", "journal", "profile"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${tab === t ? "bg-ink text-ink-foreground" : "bg-card hover:bg-muted"}`}>
                {({onboard:"Onboarding",feed:"1 Warszawa",calendar:"2 Calendar",home:"3-4 Quest",feedback:"5 Feedback",mymap:"6 My map"} as Record<string,string>)[t] ?? t}
              </button>
            ))}
          </nav>
          <Architecture />
        </section>

        <Phone tab={tab} setTab={setTab} />

        <Hints />
      </div>
    </main>
  );
}

function Phone({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="mx-auto w-[375px] rounded-[3rem] border-8 border-ink bg-background shadow-phone">
      <div className="relative h-[760px] overflow-hidden rounded-[2.5rem]">
        <div className="flex justify-between px-7 pt-3 text-xs font-medium"><span>9:41</span><span>●●● 5G</span></div>
        <div className="no-scrollbar h-[calc(100%-100px)] overflow-y-auto px-5 pb-6 pt-4">
          {tab === "onboard" && <Onboarding done={() => setTab("feed")} />}
          {tab === "feed" && <Feed />}
          {tab === "calendar" && <Calendar />}
          {tab === "feedback" && <Feedback />}
          {tab === "mymap" && <MyMap />}
          {tab === "home" && <HomeScreen />}
          {tab === "map" && <MapScreen />}
          {tab === "journal" && <Journal />}
          {tab === "profile" && <Profile />}
        </div>
        {tab !== "onboard" && (
          <div className="absolute inset-x-0 bottom-0 flex justify-around border-t bg-card px-4 pb-6 pt-3">
            {([["feed", Home, "Warszawa"], ["calendar", CalendarDays, "Calendar"], ["home", Sparkles, "Quest"], ["feedback", Smile, "Feedback"], ["mymap", MapIcon, "My map"]] as const).map(([t, I, l]) => (
              <button key={t} onClick={() => setTab(t)} className={`flex flex-col items-center gap-1 text-[11px] ${tab === t ? "text-primary" : "text-muted-foreground"}`}>
                <I className="size-5" />{l}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Onboarding({ done }: { done: () => void }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const steps = [
    { q: "What would you like more of?", opts: ["Calm", "Movement", "New people", "Culture", "Nature", "Confidence"] },
    { q: "Who's coming with you?", opts: ["Just me", "Partner", "Friends", "Kids (family events)"] },
    { q: "How far are you up for?", opts: ["My neighbourhood", "Up to 30 min", "Anywhere in Warsaw"] },
  ];
  const s = steps[step]!;
  const toggle = (o: string) => setPicked((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));
  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-8 flex gap-1.5">{steps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />)}</div>
      <p className="text-sm text-muted-foreground">Step {step + 1} of {steps.length}</p>
      <h2 className="mb-6 font-display text-4xl leading-tight">{s.q}</h2>
      <div className="flex flex-wrap gap-2">
        {s.opts.map((o) => (
          <button key={o} onClick={() => toggle(o)}
            className={`rounded-full border px-4 py-2 text-sm transition ${picked.includes(o) ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{o}</button>
        ))}
      </div>
      <button onClick={() => (step < steps.length - 1 ? setStep(step + 1) : done())}
        className="mt-auto rounded-2xl bg-ink py-4 font-medium text-ink-foreground">
        {step < steps.length - 1 ? "Continue" : "Find my first ideas"}
      </button>
    </div>
  );
}

function HomeScreen() {
  const [idx, setIdx] = useState(0);
  const [accepted, setAccepted] = useState<number | null>(null);
  const [chosen, setChosen] = useState<string[]>(["photo"]);
  const [review, setReview] = useState<null | "up" | "down">(null);
  const idea = ideas[idx % ideas.length]!;
  const I = idea.icon;

  if (accepted !== null) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">Your quest</p>
        <h2 className="font-display text-3xl leading-tight">{idea.title}</h2>
        <div className="space-y-2">
          <p className="text-sm font-medium">Pick your challenges</p>
          {tasks.map((t) => {
            const on = chosen.includes(t.id);
            return (
              <button key={t.id} onClick={() => setChosen((c) => (on ? c.filter((x) => x !== t.id) : [...c, t.id]))}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${on ? "border-sage bg-secondary" : "bg-card"}`}>
                <t.icon className="size-5" /><span className="flex-1 text-sm">{t.label}</span>
                {on && <Check className="size-4" />}
              </button>
            );
          })}
        </div>
        <div className="rounded-2xl bg-card p-4">
          <p className="mb-3 text-sm font-medium">After: how was it?</p>
          <div className="flex gap-2">
            <button onClick={() => setReview("up")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm ${review === "up" ? "bg-sage text-ink-foreground" : ""}`}><ThumbsUp className="size-4" />Good</button>
            <button onClick={() => setReview("down")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm ${review === "down" ? "bg-primary text-primary-foreground" : ""}`}><ThumbsDown className="size-4" />Not for me</button>
          </div>
          {review && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-muted p-3 text-sm">
              <span>{review === "up" ? "More like this?" : "Less of this kind?"}</span>
              <button onClick={() => { setAccepted(null); setReview(null); setIdx(idx + 1); }} className="font-medium text-primary">Yes</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">Dzień dobry, Ola</p>
        <h2 className="font-display text-3xl">Today's idea for you</h2>
      </div>
      <div className="flex gap-2 text-xs">
        <span className="rounded-full bg-secondary px-3 py-1">🔥 4-week streak</span>
        <span className="rounded-full bg-accent px-3 py-1">Mood: calm</span>
      </div>
      <div className="overflow-hidden rounded-3xl bg-card">
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-sage to-sky">
          <I className="size-16 text-ink-foreground" />
        </div>
        <div className="space-y-3 p-5">
          <span className="text-xs uppercase tracking-wider text-primary">{idea.tag} · {idea.audience}</span>
          <h3 className="font-display text-2xl leading-tight">{idea.title}</h3>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="size-3" />{idea.time}</span>
            <span className="flex items-center gap-1"><MapPin className="size-3" />{idea.district} · {idea.km} km</span>
          </div>
          <p className="flex items-start gap-2 rounded-xl bg-muted p-3 text-xs"><Sparkles className="mt-0.5 size-3 shrink-0 text-primary" />Because you want more <b>calm</b> and liked last week's park walk.</p>
        </div>
      </div>
      <div className="flex justify-center gap-6">
        <button onClick={() => setIdx(idx + 1)} className="flex size-16 items-center justify-center rounded-full border bg-card"><X className="size-6" /></button>
        <button onClick={() => setAccepted(idea.id)} className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-6" /></button>
      </div>
    </div>
  );
}

function MapScreen() {
  const [sel, setSel] = useState(ideas[0]!);
  return (
    <div className="space-y-4">
      <h2 className="font-display text-3xl">Near you</h2>
      <div className="flex gap-2 text-xs">
        {["All", "Adults", "Family", "Free"].map((f, i) => <span key={f} className={`rounded-full border px-3 py-1 ${i === 0 ? "bg-ink text-ink-foreground" : "bg-card"}`}>{f}</span>)}
      </div>
      <div className="relative h-80 overflow-hidden rounded-3xl bg-secondary">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" preserveAspectRatio="none">
          <path d="M60 0 C 55 20, 68 35, 62 50 S 70 80, 66 100" className="fill-none stroke-sky" strokeWidth="6" />
          <circle cx="45" cy="60" r="22" className="fill-none stroke-sage" strokeDasharray="2 2" strokeWidth="0.5" />
        </svg>
        <span className="absolute left-[28%] top-[86%] text-[10px] text-muted-foreground">your 30-min zone</span>
        <span className="absolute left-[44%] top-[58%] size-3 rounded-full bg-ink ring-4 ring-card" />
        {ideas.map((p) => (
          <button key={p.id} onClick={() => setSel(p)} style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-full rounded-full p-2 ${sel.id === p.id ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            <p.icon className="size-4" />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-card p-4">
        <sel.icon className="size-8 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">{sel.title}</p>
          <p className="text-xs text-muted-foreground">{sel.district} · {sel.km} km · {sel.km < 3 ? "in your area" : "city trip"}</p>
        </div>
        <ChevronRight className="size-4" />
      </div>
    </div>
  );
}

function Journal() {
  const tones = ["from-sage to-sky", "from-sun to-primary", "from-sky to-sage", "from-primary to-sun", "from-sage to-sun", "from-sky to-primary"];
  return (
    <div className="space-y-5">
      <h2 className="font-display text-3xl">Your October</h2>
      <div className="rounded-3xl bg-ink p-5 text-ink-foreground">
        <p className="text-xs uppercase tracking-wider opacity-70">Monthly story</p>
        <p className="mt-2 font-display text-2xl leading-tight">12 activities, 7 districts, 3 new people.</p>
        <div className="mt-4 flex gap-1">{[1, 1, 1, 0.4, 0.4].map((o, i) => <div key={i} className="h-1 flex-1 rounded-full bg-ink-foreground" style={{ opacity: o }} />)}</div>
        <button className="mt-4 text-sm underline">Play story ▸</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tones.map((t, i) => <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${t}`} />)}
      </div>
      <div className="space-y-2">
        {[["Pole Mokotowskie walk", "🎙 0:42 reflection", "👍"], ["Board games, Praga", "📷 3 photos · talked to a stranger", "👍"], ["Gym trial", "📷 1 photo", "👎"]].map(([a, b, c]) => (
          <div key={a} className="flex items-center gap-3 rounded-2xl bg-card p-3">
            <div className="flex-1"><p className="text-sm font-medium">{a}</p><p className="text-xs text-muted-foreground">{b}</p></div><span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const interests = [["Nature", 80, "bg-sage"], ["Culture", 55, "bg-primary"], ["Sport", 35, "bg-sky"], ["Social", 25, "bg-sun"]] as const;
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="size-14 rounded-full bg-gradient-to-br from-primary to-sun" />
        <div><h2 className="font-display text-2xl">Ola</h2><p className="text-xs text-muted-foreground">Mokotów · explorer since Sep</p></div>
      </div>
      <div className="rounded-3xl bg-card p-5">
        <p className="mb-3 text-sm font-medium">Your interest mix</p>
        {interests.map(([n, v, c]) => (
          <div key={n} className="mb-2"><div className="mb-1 flex justify-between text-xs"><span>{n}</span><span>{v}%</span></div>
            <div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${c}`} style={{ width: `${v}%` }} /></div></div>
        ))}
      </div>
      <div className="rounded-3xl bg-card p-5">
        <p className="mb-3 text-sm font-medium">Districts explored · 7 / 18</p>
        <div className="grid grid-cols-6 gap-1.5">{Array.from({ length: 18 }).map((_, i) => <div key={i} className={`aspect-square rounded-md ${i < 7 ? "bg-sage" : "bg-muted"}`} />)}</div>
      </div>
      <div className="space-y-2 rounded-3xl bg-card p-5 text-sm">
        <div className="flex items-center gap-2"><Users className="size-4" />Event type: <b>Adults</b></div>
        <div className="flex items-center gap-2"><Baby className="size-4" />Family events: <b>off</b></div>
      </div>
    </div>
  );
}

function Architecture() {
  const rows = [
    ["Onboarding", "goals, company, distance, adult/family"],
    ["Today", "1 idea card → accept / skip → pick challenges → review"],
    ["Map", "ideas near you, 30-min zone, filters"],
    ["Journal", "photos, voice notes, monthly story"],
    ["Me", "interest mix, districts explored, settings"],
  ];
  return (
    <div className="rounded-3xl bg-card p-5">
      <p className="mb-3 text-sm font-medium">App structure</p>
      <ul className="space-y-2 text-sm">{rows.map(([a, b]) => <li key={a}><b>{a}</b> <span className="text-muted-foreground">— {b}</span></li>)}</ul>
    </div>
  );
}

function Hints() {
  const hints = [
    ["One idea, not a feed", "Showing a single card lowers decision fatigue — key for anxious or low-energy users."],
    ["Energy check-in", "Ask “how much energy today?” and scale ideas: 10-min bench sit vs. a meetup."],
    ["Open data sources", "Warsaw API (api.um.warszawa.pl): parks, sports facilities, pools, libraries, cultural events, ZTM transit for travel time."],
    ["Bring-a-buddy", "Let users invite a friend or join others doing the same quest — that's how community forms."],
    ["Safe, not clinical", "Avoid diagnosis language; link to free Warsaw support lines (e.g. 116 123) in settings."],
    ["Explore vs. comfort", "Mix 80% matches with 20% ‘wildcards’ so the profile doesn't trap people in a bubble."],
    ["Weather-aware", "Swap outdoor ideas for indoor ones when it rains — keeps streaks alive."],
    ["Privacy", "Store photos & voice notes on device by default; opt-in sharing."],
  ];
  return (
    <section className="space-y-3 lg:pt-10">
      <p className="text-sm font-medium">Ideas to strengthen the concept</p>
      {hints.map(([t, d]) => (
        <div key={t} className="rounded-2xl border bg-card p-4">
          <p className="font-display text-xl">{t}</p>
          <p className="text-sm text-muted-foreground">{d}</p>
        </div>
      ))}
    </section>
  );
}

const cats = ["All", "Nature", "Sport", "Culture", "Social", "Family"];
const feedItems = [
  { t: "Night at Copernicus Science Centre", c: "Culture", src: "Open Data", d: "Fri 19:00", g: "from-sky to-sage" },
  { t: "Morning run club, Wisła boulevards", c: "Sport", src: "Facebook", d: "Sat 08:00", g: "from-sun to-primary" },
  { t: "Ogród Saski picnic & book swap", c: "Social", src: "Facebook", d: "Sun 13:00", g: "from-sage to-sun" },
  { t: "Free entry — Łazienki Palace", c: "Culture", src: "Open Data", d: "Thu all day", g: "from-primary to-sky" },
];

function Feed() {
  const [cat, setCat] = useState("All");
  const list = feedItems.filter((f) => cat === "All" || f.c === cat);
  return (
    <div className="space-y-4">
      <h2 className="font-display text-4xl">Warszawa</h2>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 text-xs">
        {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full border px-3 py-1 ${cat === c ? "bg-ink text-ink-foreground" : "bg-card"}`}>{c}</button>)}
      </div>
      {list.map((f) => (
        <div key={f.t} className="overflow-hidden rounded-3xl bg-card">
          <div className={`h-28 bg-gradient-to-br ${f.g}`} />
          <div className="flex items-end gap-3 p-4">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-primary">{f.c} · via {f.src}</p>
              <p className="font-medium">{f.t}</p>
              <p className="text-xs text-muted-foreground">{f.d}</p>
            </div>
            <button className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus className="size-4" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Calendar() {
  const [plan, setPlan] = useState<Record<number, boolean>>({ 2: true, 4: true });
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const items = ["Bench & tea, Pole Mokotowskie", "Pool open swim", "Jazz, Stare Miasto", "Library meetup", "Night at Copernicus", "Run club", "Picnic, Ogród Saski"];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-4xl">This week</h2>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {days.map((d, i) => <div key={d} className={`rounded-xl py-2 ${plan[i] ? "bg-primary text-primary-foreground" : "bg-card"}`}>{d}<div className="text-sm font-medium">{19 + i}</div></div>)}
      </div>
      {items.map((it, i) => (
        <div key={it} className={`flex items-center gap-3 rounded-2xl p-3 ${plan[i] ? "bg-secondary" : "bg-card"}`}>
          <span className="w-8 text-xs text-muted-foreground">{days[i]}</span>
          <span className="flex-1 text-sm">{it}</span>
          <button onClick={() => setPlan({ ...plan, [i]: !plan[i] })} className="flex size-8 items-center justify-center rounded-full border bg-card">
            {plan[i] ? <Minus className="size-4" /> : <Plus className="size-4" />}
          </button>
        </div>
      ))}
    </div>
  );
}

function Feedback() {
  const [mood, setMood] = useState<number | null>(null);
  const [rec, setRec] = useState(false);
  const qs = ["What surprised you?", "Did you meet anyone?", "Would you go again?"];
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Jazz at Stare Miasto · just now</p>
      <h2 className="font-display text-4xl">How was it?</h2>
      <div className="flex justify-between">
        {["😞", "😐", "🙂", "😄", "🤩"].map((e, i) => (
          <button key={e} onClick={() => setMood(i)} className={`flex size-14 items-center justify-center rounded-full text-2xl ${mood === i ? "bg-accent ring-2 ring-primary" : "bg-card"}`}>{e}</button>
        ))}
      </div>
      <div className="space-y-2">{qs.map((q) => <div key={q} className="rounded-2xl bg-card p-4 text-sm">{q}<div className="mt-2 h-px bg-border" /></div>)}</div>
      <button onClick={() => setRec(!rec)} className={`flex w-full items-center justify-center gap-3 rounded-3xl py-6 ${rec ? "bg-primary text-primary-foreground" : "bg-ink text-ink-foreground"}`}>
        {rec ? <Mic className="size-6 animate-pulse" /> : <Play className="size-6" />}
        {rec ? "Recording… tap to stop" : "Answer with a voice note"}
      </button>
    </div>
  );
}

function MyMap() {
  const spots = [
    { n: "Mokotów", x: 40, y: 65, r: 22, c: "bg-sage" },
    { n: "Śródmieście", x: 50, y: 40, r: 18, c: "bg-primary" },
    { n: "Praga", x: 75, y: 35, r: 12, c: "bg-sky" },
    { n: "Wola", x: 25, y: 35, r: 9, c: "bg-sun" },
    { n: "Żoliborz", x: 42, y: 15, r: 7, c: "bg-sage" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-4xl">My map</h2>
      <p className="text-sm text-muted-foreground">Bigger bubble = more memories there. Tap to open photos.</p>
      <div className="relative h-96 overflow-hidden rounded-3xl bg-card">
        {spots.map((s) => (
          <button key={s.n} style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.r * 4}px`, height: `${s.r * 4}px` }}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-medium opacity-90 ${s.c}`}>{s.n}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-2xl bg-card p-3"><b className="block text-lg">12</b>activities</div>
        <div className="rounded-2xl bg-card p-3"><b className="block text-lg">5</b>districts</div>
        <div className="rounded-2xl bg-card p-3"><b className="block text-lg">31</b>photos</div>
      </div>
    </div>
  );
}
