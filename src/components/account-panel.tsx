import { useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { usePersonalData } from "@/lib/personal-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@lovable.dev/cloud-auth-js/styles.css";

export function AccountPanel() {
  const { t } = useLanguage();
  const { user, signOut } = usePersonalData();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const run = async (action: () => Promise<void>) => { setBusy(true); setError(""); setNotice(""); try { await action(); } catch (e) { setError(e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e)); } finally { setBusy(false); } };
  if (user) return <div className="space-y-3"><p className="break-all text-sm text-muted-foreground">{user.email}</p><Button variant="outline" onClick={() => run(signOut)} disabled={busy}>{t("Sign out")}</Button>{error && <p role="alert" className="text-sm text-destructive">{t(error)}</p>}</div>;
  return <div className="space-y-4">
    <h3 className="font-display text-xl font-semibold">{t(mode === "signup" ? "Create account" : mode === "reset" ? "Reset password" : "Sign in to save your memories")}</h3>
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); void run(async () => {
      if (mode === "reset") { const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (result.error) throw result.error; setNotice("Check your email for a reset link"); return; }
      const result = mode === "signup" ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } }) : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (mode === "signup" && !result.data.session) setNotice("Check your email to confirm your account");
    }); }}>
      <label className="block space-y-1 text-sm"><span>{t("Email")}</span><Input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      {mode !== "reset" && <label className="block space-y-1 text-sm"><span>{t("Password")}</span><Input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={8} /></label>}
      <Button type="submit" className="w-full" disabled={busy}>{t(busy ? "Saving…" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in")}</Button>
    </form>
    {mode !== "reset" && <div className="space-y-2">
      <Button variant="outline" className="w-full" disabled={busy} onClick={() => run(async () => { const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin }); if (result.error) throw result.error; })}>{t("Continue with Google")}</Button>
      <Button className="lovable-auth-button w-full" disabled={busy} onClick={() => run(async () => { const result = await lovable.auth.signInWithOAuth("lovable", { redirect_uri: window.location.origin }); if (result.error) throw result.error; })}>{t("Continue with Lovable")}</Button>
    </div>}
    <div className="flex flex-wrap gap-2"><Button variant="ghost" size="sm" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setNotice(""); }}>{t(mode === "signup" ? "Sign in" : "Create account")}</Button><Button variant="ghost" size="sm" onClick={() => setMode(mode === "reset" ? "login" : "reset")}>{t(mode === "reset" ? "Sign in" : "Forgot password?")}</Button></div>
    {notice && <p role="status" className="text-sm text-primary">{t(notice)}</p>}{error && <p role="alert" className="text-sm text-destructive">{t(error)}</p>}
  </div>;
}