import { useRef, useState } from "react";
import { Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonalData } from "@/lib/personal-data";
import { useLanguage } from "@/lib/language";
export function PhotoUpload({ eventId, origin, onUploaded }: { eventId: number; origin: "quest" | "reflection"; onUploaded?: (id: string) => void }) {
  const { t } = useLanguage(); const { user, upload } = usePersonalData();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  return <div className="space-y-2"><input ref={input} type="file" accept="image/*" multiple className="hidden" aria-label={t("Add photos")} onChange={async e => {
    const files = Array.from(e.target.files ?? []); e.target.value = ""; setBusy(true); setError("");
    try { for (const file of files) { const row = await upload(file, eventId, "photo", origin); onUploaded?.(row.id); } } catch (err) { setError((err as Error).message ?? String(err)); } finally { setBusy(false); }
  }} /><Button variant="outline" className="w-full" disabled={busy || !user} onClick={() => input.current?.click()}><Camera className="size-4" />{t(busy ? "Saving…" : "Add photos")}<Plus className="ml-auto size-4" /></Button>{error && <p role="alert" className="text-sm text-destructive">{t(error)}</p>}</div>;
}