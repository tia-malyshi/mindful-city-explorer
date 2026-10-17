import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountPanel } from "@/components/account-panel";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/auth")({ head: () => ({ meta: [{ title: "MojaWawa — personal account" }, { name: "description", content: "Sign in to save private Warsaw reflections and photo memories." }, { property: "og:title", content: "MojaWawa — personal account" }, { property: "og:description", content: "Your private city experiences and memories." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Auth });
function Auth() { const { t } = useLanguage(); return <main className="mx-auto max-w-sm space-y-6 px-6 py-16"><h1 className="font-display text-3xl font-bold">MojaWawa</h1><AccountPanel /><Button variant="ghost" asChild><Link to="/">{t("Go home")}</Link></Button></main>; }