import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { calendarMinutes } from "@/lib/calendar-time";

type CalendarActivity = { id: number; t: string; day: number; time: string };
export function WeekTimeline({ days, events, selected, select, planned, toggle, move }: {
  days: number[]; events: CalendarActivity[]; selected: number; select: (day: number) => void;
  planned: number[]; toggle: (id: number) => void; move: (direction: number) => void;
}) {
  const { t, language } = useLanguage();
  const names = language === "pl" ? ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"] : language === "ru" ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timed = events.filter((event) => days.includes(event.day) && calendarMinutes(event.time) !== null);
  const untimed = events.filter((event) => days.includes(event.day) && calendarMinutes(event.time) === null);
  const firstHour = Math.min(7, ...timed.map((event) => Math.floor((calendarMinutes(event.time) ?? 420) / 60)));
  const hours = Array.from({ length: 23 - firstHour }, (_, i) => firstHour + i);
  return <section className="space-y-3" aria-label={t("Week")}>
    <div className="flex items-center justify-between"><Button variant="ghost" size="icon" aria-label={t("Previous week")} disabled={days[0] === 1} onClick={() => move(-1)}><ChevronLeft /></Button><span className="text-sm font-bold">{days[0]}–{days.at(-1)} {t("Oct")}</span><Button variant="ghost" size="icon" aria-label={t("Next week")} disabled={days.at(-1) === 31} onClick={() => move(1)}><ChevronRight /></Button></div>
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Check className="size-3 text-primary" />{t("Planned")}</span><span>{t("Suggested")}</span></div>
    <div className="max-h-[480px] overflow-auto rounded-lg border" tabIndex={0}>
      <div className="grid min-w-[650px] grid-cols-[42px_repeat(7,minmax(0,1fr))]">
        <div className="sticky left-0 top-0 z-30 border-b bg-background" />
        {days.map((day) => <Button key={day} variant="ghost" onClick={() => select(day)} className={`sticky top-0 z-20 h-14 flex-col gap-0 rounded-none border-b border-l bg-background px-1 text-xs ${day === selected ? "text-primary" : "text-foreground"}`}><span>{names[(day + 2) % 7]}</span><b>{day}</b></Button>)}
        <div className="sticky left-0 z-10 bg-background">{hours.map((hour) => <div key={hour} className="h-16 border-b pt-1 text-center text-[10px] text-muted-foreground">{String(hour).padStart(2, "0")}:00</div>)}</div>
        {days.map((day) => <div key={day} className="relative border-l">
          {hours.map((hour) => <div key={hour} className="h-16 border-b" />)}
          {timed.filter((event) => event.day === day).map((event) => {
            const minute = calendarMinutes(event.time);
            if (minute === null) return null;
            const saved = planned.includes(event.id);
            return <Button key={event.id} variant="outline" title={`${t(event.t)} · ${event.time}`} aria-label={`${t(event.t)} · ${event.time}`} aria-pressed={saved} onClick={() => { select(day); toggle(event.id); }} style={{ top: ((minute - firstHour * 60) / 60) * 64 }} className={`absolute inset-x-1 h-[60px] flex-col items-start justify-start gap-0.5 overflow-hidden whitespace-normal rounded-md px-1 py-1 text-left text-[10px] leading-tight ${saved ? "border-primary bg-primary text-primary-foreground" : "border-dashed border-primary bg-secondary text-secondary-foreground"}`}><b className="flex items-center gap-1">{event.time}{saved && <Check className="size-3" />}</b><span className="line-clamp-3">{t(event.t)}</span></Button>;
          })}
        </div>)}
      </div>
    </div>
    {untimed.length > 0 && <div className="space-y-2"><p className="text-xs text-muted-foreground">{t("Flexible time")}</p>{untimed.map((event) => <Button key={event.id} variant="outline" onClick={() => select(event.day)} className="h-auto w-full justify-start whitespace-normal text-left">{event.day} {t("Oct")} · {t(event.t)}</Button>)}</div>}
  </section>;
}