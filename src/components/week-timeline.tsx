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
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => <Button key={day} variant="ghost" aria-pressed={day === selected} onClick={() => select(day)} className={`h-16 min-w-0 flex-col gap-1 rounded-lg px-0 text-xs ${day === selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><span>{names[(day + 2) % 7]}</span><b>{day}</b><span className={`size-1 rounded-full ${events.some((event) => event.day === day) ? "bg-current" : "bg-transparent"}`} /></Button>)}
    </div>
    <div className="grid grid-cols-[42px_minmax(0,1fr)]">
        <div>{hours.map((hour) => <div key={hour} className="h-16 pt-1 text-[10px] tabular-nums text-muted-foreground">{String(hour).padStart(2, "0")}:00</div>)}</div>
        <div className="relative border-l">
          {hours.map((hour) => <div key={hour} className="h-16 border-b" />)}
          {timed.filter((event) => event.day === selected).map((event) => {
            const minute = calendarMinutes(event.time);
            if (minute === null) return null;
            const saved = planned.includes(event.id);
            return <Button key={event.id} variant="outline" title={`${t(event.t)} · ${event.time}`} aria-label={`${t(event.t)} · ${event.time}`} aria-pressed={saved} onClick={() => toggle(event.id)} style={{ top: ((minute - firstHour * 60) / 60) * 64 }} className={`absolute inset-x-2 h-[60px] flex-col items-start justify-start gap-0.5 overflow-hidden whitespace-normal rounded-md px-3 py-2 text-left text-xs leading-tight ${saved ? "border-primary bg-primary text-primary-foreground" : "border-dashed border-primary bg-secondary text-secondary-foreground"}`}><b className="flex items-center gap-1">{event.time}{saved && <Check className="size-3" />}</b><span className="line-clamp-2">{t(event.t)}</span></Button>;
          })}
        </div>
    </div>
    {untimed.some((event) => event.day === selected) && <div className="space-y-2"><p className="text-xs text-muted-foreground">{t("Flexible time")}</p>{untimed.filter((event) => event.day === selected).map((event) => <Button key={event.id} variant="outline" aria-pressed={planned.includes(event.id)} onClick={() => toggle(event.id)} className="h-auto w-full justify-start whitespace-normal text-left">{t(event.t)}{planned.includes(event.id) && <Check className="size-4 shrink-0" />}</Button>)}</div>}
  </section>;
}