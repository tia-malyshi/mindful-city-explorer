import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { VoiceAnswer } from "@/components/voice-answer";
import { LanguageProvider } from "@/lib/language";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); localStorage.clear(); });
it("uploads a complete recording only after stopping and releases the microphone", async () => {
  localStorage.setItem("mojawawa-language", "en");
  const stop = vi.fn(); const onRecorded = vi.fn(async (_: Blob) => {});
  vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop }] })) } });
  class Recorder {
    static isTypeSupported() { return true; }
    mimeType = "audio/webm"; state = "inactive";
    ondataavailable?: (event: { data: Blob }) => void;
    onstop?: () => void;
    start() { this.state = "recording"; }
    stop() { this.state = "inactive"; this.ondataavailable?.({ data: new Blob(["complete audio"], { type: "audio/webm" }) }); this.onstop?.(); }
  }
  vi.stubGlobal("MediaRecorder", Recorder);
  render(<LanguageProvider><VoiceAnswer onRecorded={onRecorded} /></LanguageProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Answer with your voice" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Stop recording" })).toBeTruthy());
  expect(onRecorded).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
  await waitFor(() => expect(onRecorded).toHaveBeenCalledTimes(1));
  expect(onRecorded.mock.calls[0]?.[0].size).toBe(14);
  expect(stop).toHaveBeenCalledTimes(1);
});
it("shows a permission failure without saving an empty recording", async () => {
  localStorage.setItem("mojawawa-language", "en");
  const onRecorded = vi.fn(async (_: Blob) => {});
  vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn(async () => { throw new Error("denied"); }) } });
  vi.stubGlobal("MediaRecorder", class {});
  render(<LanguageProvider><VoiceAnswer onRecorded={onRecorded} /></LanguageProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Answer with your voice" }));
  await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
  expect(onRecorded).not.toHaveBeenCalled();
});