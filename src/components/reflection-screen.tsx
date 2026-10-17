import { useState } from "react";
import { BookHeart, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/language";
import { usePersonalData } from "@/lib/personal-data";
import { AccountPanel } from "@/components/account-panel";
import { PhotoUpload } from "@/components/photo-upload";
import { VoiceAnswer } from "@/components/voice-answer";
import { MemoriesScreen } from "@/components/memories-screen";

export type ReflectionEvent = { id: number; t: string; c: string; district: string; img: string };
const questions = ["What surprised you?", "Did you meet anyone?", "Would you go again?"];
export function ReflectionScreen({ events, eventId, setEventId, initialMemories = false }: { events: ReflectionEvent[]; eventId: number; setEventId: (id: number) => void; initialMemories?: boolean }) {
  const { t } = useLanguage(); const personal = usePersonalData();
  const [view, setView] = useState(initialMemories ? "memories" : "reflection");
  const [rating, setRating] = useState(0); const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [error, setError] = useState("");
  const [autoMemory, setAutoMemory] = useState(true);
  const event = events.find(item => item.id === eventId) ?? events[0];
  if (!event) return null;
  const draftMedia = personal.data.media.filter(item => item.event_id === event.id && item.reflection_id === null);
  return <div className="space-y-5 pt-2">
    <h2 className="font-display text-3xl font-black">{t("Reflection")}</h2>
    <div className="flex border-b"><Button variant="ghost" aria-pressed={view === "reflection"} onClick={() => setView("reflection")} className={`flex-1 rounded-none border-b-2 ${view === "reflection" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}><Star className="size-4" />{t("Experience")}</Button><Button variant="ghost" aria-pressed={view === "memories"} onClick={() => setView("memories")} className={`flex-1 rounded-none border-b-2 ${view === "memories" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}><BookHeart className="size-4" />{t("Memories")}</Button></div>
    {!personal.authReady || personal.loading ? <p role="status" className="text-sm text-muted-foreground">{t("Loading…")}</p> : !personal.user ? <AccountPanel /> : personal.error ? <div><p role="alert" className="text-sm text-destructive">{personal.error.message}</p><Button onClick={() => personal.refreshData()}>{t("Try again")}</Button></div> : view === "memories" ? <MemoriesScreen /> : <>
      <Select value={String(event.id)} onValueChange={value => { setEventId(Number(value)); setRating(0); setAnswers({}); setNotice(""); setError(""); }}><SelectTrigger className="h-auto min-h-11 w-full whitespace-normal text-left"><SelectValue /></SelectTrigger><SelectContent>{events.map(item => <SelectItem key={item.id} value={String(item.id)}>{t(item.t)}</SelectItem>)}</SelectContent></Select>
      <img src={event.img} alt={t(event.t)} className="aspect-[2/1] w-full rounded-lg object-cover" />
      <div className="space-y-3"><h3 className="font-display text-xl font-semibold">{t("How was it?")}</h3><div className="flex justify-between" role="group" aria-label={t("Experience rating")}>{[1, 2, 3, 4, 5].map(value => <Button key={value} size="icon" variant="ghost" aria-label={`${t("Rating")} ${value}/5`} aria-pressed={rating === value} onClick={() => setRating(value)} className={`size-12 rounded-full ${value <= rating ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Star className={`size-6 ${value <= rating ? "fill-current" : ""}`} /></Button>)}</div></div>
      <section className="space-y-3"><h3 className="font-display text-lg font-semibold">{t("Your photos")}</h3><div className="grid grid-cols-3 gap-2">{draftMedia.filter(item => item.kind === "photo").map(item => <div key={item.id}><img src={item.url} alt={t(item.origin === "quest" ? "Quest photo" : "Reflection photo")} className="aspect-square w-full rounded-lg object-cover" /><span className="text-[10px] text-muted-foreground">{t(item.origin === "quest" ? "Quest" : "Reflection")}</span></div>)}</div><PhotoUpload eventId={event.id} origin="reflection" /></section>
      {questions.map(question => <section key={question} className="space-y-2 border-t pt-4"><label htmlFor={`answer-${questions.indexOf(question)}`} className="block text-sm font-semibold">{t(question)}</label><Textarea id={`answer-${questions.indexOf(question)}`} value={answers[question] ?? ""} onChange={e => setAnswers({ ...answers, [question]: e.target.value })} placeholder={t("Write your answer…")} className="min-h-20 resize-none" /><VoiceAnswer key={`${event.id}-${question}`} disabled={busy} onRecorded={async blob => { await personal.upload(blob, event.id, "voice", "reflection", question); }} />{draftMedia.filter(item => item.kind === "voice" && item.question === question).map(item => <audio key={item.id} controls src={item.url} className="w-full" aria-label={t(question)} />)}</section>)}
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 size-4 accent-primary" checked={autoMemory} onChange={e => setAutoMemory(e.target.checked)} /><span>{t("Create a photo memory when I save")}</span></label>
      <Button className="h-12 w-full" disabled={busy || !rating} onClick={async () => {
        setBusy(true); setError(""); setNotice("");
        try {
          await personal.saveReflection(event, rating, answers, draftMedia.map(item => item.id));
          setRating(0); setAnswers({}); setNotice("Reflection saved");
          if (autoMemory && draftMedia.some(item => item.kind === "photo")) {
            try { await personal.makeMemory(draftMedia); setNotice("Reflection and memory saved"); } catch (err) { setError(`${t("Reflection saved")}. ${(err as Error).message}`); }
          }
        } catch (err) { setError((err as Error).message ?? String(err)); } finally { setBusy(false); }
      }}><Check className="size-4" />{t(busy ? "Saving…" : "Save reflection")}</Button>
      {notice && <p role="status" className="text-sm text-primary">{t(notice)}</p>}{error && <p role="alert" className="text-sm text-destructive">{t(error)}</p>}
    </>}
  </div>;
}