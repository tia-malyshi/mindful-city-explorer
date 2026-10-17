import { useState } from "react";
import { X, UserRound, Settings, UserPlus, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language";
import { ProfileInterests } from "@/components/profile-interests";
import type { ReflectionRow, MediaRow } from "@/lib/personal-data";

export type ProfileAnswer = { question: string; values: string[] };
export function ProfileMenu({ close, settings, quest, account, save, answers, name, setName, reflections, media, loading, error }: {
  close: () => void; settings: () => void; quest: () => void;
  interests?: () => void; account?: React.ReactNode; save?: () => Promise<void>;
  reflections?: ReflectionRow[]; media?: MediaRow[]; loading?: boolean; error?: boolean;
  answers: ProfileAnswer[]; name: string; setName: (name: string) => void;
}) {
  const { t } = useLanguage();
  const [invite, setInvite] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState("");
  const share = async () => {
    const text = `${t("Explore Warsaw with me on MojaWawa")} — ${window.location.origin}`;
    try {
      if (navigator.share) { await navigator.share({ title: "MojaWawa", text, url: window.location.origin }); return; }
      await navigator.clipboard.writeText(text); setCopied(true);
    } catch { setInvite(text); }
  };
  return <div role="dialog" aria-modal="true" aria-label={t("Profile")} className="no-scrollbar absolute inset-0 z-30 overflow-y-auto bg-background px-6 pb-10 pt-12">
    <div className="mb-7 flex items-center justify-between"><h2 className="font-display text-3xl font-semibold">{t("Profile")}</h2><Button variant="ghost" size="icon" aria-label={t("Close profile")} onClick={close}><X /></Button></div>
    <div className="mb-5 flex items-center gap-3"><UserRound className="size-10 text-primary" /><span className="font-display text-xl font-semibold">{name || t("You")}</span></div>
    {loading ? <p role="status" className="mb-6 text-sm text-muted-foreground">{t("Loading…")}</p> : error ? <p role="alert" className="mb-6 text-sm text-destructive">{t("Could not load your activities")}</p> : <div className="mb-7"><ProfileInterests answers={answers} reflections={reflections} media={media} /></div>}
    <h3 className="mb-4 border-t pt-6 font-display text-xl font-semibold">{t("Profile details")}</h3>
    <label htmlFor="profile-name" className="mb-2 block text-sm text-muted-foreground">{t("Name")}</label>
    <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Not provided")} />
    {save && <Button className="mt-3" onClick={async () => { try { await save(); setSaveState("Profile saved"); } catch (error) { setSaveState((error as Error).message); } }}>{t("Save profile")}</Button>}
    {saveState && <p role="status" className="mt-2 text-sm text-primary">{t(saveState)}</p>}
    <div className="my-6 divide-y border-y">
      <Button variant="ghost" onClick={settings} className="h-14 w-full justify-start rounded-none px-0"><Settings />{t("Account settings")}<ChevronRight className="ml-auto" /></Button>
      <Button variant="ghost" onClick={share} className="h-14 w-full justify-start rounded-none px-0"><UserPlus />{t("Invite a friend")}<ChevronRight className="ml-auto" /></Button>
      <Button variant="ghost" onClick={quest} className="h-14 w-full justify-start rounded-none px-0"><Sparkles />{t("Quest")}<ChevronRight className="ml-auto" /></Button>
    </div>
    {copied && <p role="status" className="mb-5 text-sm text-primary">{t("Invitation copied")}</p>}
    {invite && <Input aria-label={t("Copy invitation")} readOnly value={invite} onFocus={(e) => e.target.select()} />}
    {account && <div className="mb-6 border-b pb-6">{account}</div>}
    <h3 className="mb-4 font-display text-xl font-semibold">{t("Your answers")}</h3>
    {answers.length === 0 ? <p className="text-sm text-muted-foreground">{t("Not provided")}</p> : <dl className="divide-y">{answers.map((answer) => <div key={answer.question} className="py-4"><dt className="mb-1 text-sm text-muted-foreground">{t(answer.question)}</dt><dd className="text-sm">{answer.values.length ? answer.values.map(t).join(" · ") : t("Not provided")}</dd></div>)}</dl>}
  </div>;
}