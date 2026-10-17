import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language";
export const Route = createFileRoute("/reset-password")({ head: () => ({ meta: [{ title: "MojaWawa — reset password" }, { name: "description", content: "Choose a new password for your private MojaWawa account." }, { property: "og:title", content: "MojaWawa — reset password" }, { property: "og:description", content: "Recover access to your private memories." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: ResetPassword });
function ResetPassword() {
  const { t } = useLanguage(); const [recovery, setRecovery] = useState(false); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { setRecovery(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"); }, []);
  return <main className="mx-auto max-w-sm space-y-5 px-6 py-16"><h1 className="font-display text-3xl font-bold">{t("Reset password")}</h1>{recovery ? <form className="space-y-4" onSubmit={async e => { e.preventDefault(); setBusy(true); const { error } = await supabase.auth.updateUser({ password }); setMessage(error?.message ?? "Password updated"); setBusy(false); }}><label className="block space-y-2"><span>{t("New password")}</span><Input type="password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></label><Button disabled={busy}>{t("Save password")}</Button></form> : <p>{t("Open the password reset link from your email")}</p>}{message && <p role="status">{t(message)}</p>}<Button asChild variant="ghost"><Link to="/auth">{t("Sign in")}</Link></Button></main>;
}