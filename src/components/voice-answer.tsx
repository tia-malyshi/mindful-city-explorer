import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";

export function VoiceAnswer({ onRecorded, disabled }: { onRecorded: (blob: Blob) => Promise<void>; disabled?: boolean }) {
  const { t } = useLanguage();
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const alive = useRef(true);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { alive.current = true; return () => { alive.current = false; if (recorder.current?.state === "recording") recorder.current.stop(); stream.current?.getTracks().forEach(track => track.stop()); }; }, []);
  const start = async () => {
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") throw new Error("Voice recording is unavailable in this browser");
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) { audio.getTracks().forEach(track => track.stop()); return; }
      stream.current = audio;
      const type = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"].find(value => MediaRecorder.isTypeSupported(value));
      const next = new MediaRecorder(audio, type ? { mimeType: type } : undefined);
      recorder.current = next;
      const chunks: Blob[] = [];
      next.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      next.onerror = () => { setError("Recording failed. Try again."); audio.getTracks().forEach(track => track.stop()); setRecording(false); };
      next.onstop = async () => {
        audio.getTracks().forEach(track => track.stop());
        if (!alive.current) return;
        setRecording(false); setBusy(true);
        try { await onRecorded(new Blob(chunks, { type: next.mimeType })); } catch (e) { setError((e as Error).message ?? "Recording failed. Try again."); } finally { if (alive.current) setBusy(false); }
      };
      next.start(); setRecording(true);
    } catch { setError("Microphone unavailable. Allow access or write your answer."); }
  };
  return <div className="space-y-2"><Button variant={recording ? "destructive" : "outline"} disabled={busy || disabled} className="w-full" onClick={() => recording ? recorder.current?.stop() : void start()}>{recording ? <Square className="size-4" /> : <Mic className="size-4" />}{t(busy ? "Saving…" : recording ? "Stop recording" : "Answer with your voice")}</Button>{error && <p role="alert" className="text-sm text-destructive">{t(error)}</p>}</div>;
}