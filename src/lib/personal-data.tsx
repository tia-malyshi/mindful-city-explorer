import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { pickMemoryPhotos, validRating } from "@/lib/reflection-logic";

type Row<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type ReflectionRow = Row<"reflections">;
export type MediaRow = Row<"reflection_media"> & { url: string };
export type MemoryRow = Row<"memories">;
export type PersonalData = { profile: Row<"profiles"> | null; reflections: ReflectionRow[]; media: MediaRow[]; memories: MemoryRow[] };
const empty: PersonalData = { profile: null, reflections: [], media: [], memories: [] };
async function readPersonalData(): Promise<PersonalData> {
  const results = await Promise.all([
    supabase.from("profiles").select("*").single(),
    supabase.from("reflections").select("*").order("created_at", { ascending: false }),
    supabase.from("reflection_media").select("*").order("created_at", { ascending: false }),
    supabase.from("memories").select("*").order("created_at", { ascending: false }),
  ]);
  for (const result of results) if (result.error) throw result.error;
  const media = await Promise.all((results[2].data ?? []).map(async row => {
    const { data, error } = await supabase.storage.from("reflections").createSignedUrl(row.path, 900);
    if (error) throw error;
    return { ...row, url: data.signedUrl };
  }));
  return { profile: results[0].data, reflections: results[1].data ?? [], media, memories: results[3].data ?? [] };
}
function usePersonalState() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) { setUser(data.user); setAuthReady(true); }
    };
    void refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      if (event === "SIGNED_OUT") { setUser(null); queryClient.removeQueries({ queryKey: ["personal"] }); }
      else setTimeout(() => { if (active) { void refresh(); void queryClient.invalidateQueries({ queryKey: ["personal"] }); } }, 0);
      void router.invalidate();
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [queryClient, router]);
  const query = useQuery({ queryKey: ["personal", user?.id], queryFn: readPersonalData, enabled: !!user, refetchInterval: 600_000 });
  const refreshData = () => queryClient.invalidateQueries({ queryKey: ["personal", user?.id] });
  const requireUser = () => { if (!user) throw new Error("Sign in to save your memories"); return user.id; };
  const upload = async (file: Blob, eventId: number, kind: "photo" | "voice", origin: "quest" | "reflection", question?: string) => {
    const userId = requireUser();
    if (file.size > 20 * 1024 * 1024) throw new Error("File is too large (20 MB maximum)");
    if (file.size === 0 || (kind === "photo" ? !file.type.startsWith("image/") : !file.type.startsWith("audio/"))) throw new Error("Choose an image or audio file");
    const path = `${userId}/${crypto.randomUUID()}`;
    const { error } = await supabase.storage.from("reflections").upload(path, file, { contentType: file.type });
    if (error) throw error;
    const row = await supabase.from("reflection_media").insert({ user_id: userId, event_id: eventId, kind, origin, question: question ?? null, path }).select().single();
    if (row.error) { await supabase.storage.from("reflections").remove([path]); throw row.error; }
    await refreshData();
    return row.data;
  };
  const makeMemory = async (media: { id: string; kind: string }[] = query.data?.media ?? []) => {
    const photoIds = pickMemoryPhotos(media).map(photo => photo.id);
    if (!photoIds.length) throw new Error("Add photos to create a memory");
    const { error } = await supabase.from("memories").insert({ user_id: requireUser(), photo_ids: photoIds });
    if (error) throw error;
    await refreshData();
  };
  const saveReflection = async (event: { id: number; t: string; c: string; district: string }, rating: number, answers: Record<string, string>, mediaIds: string[]) => {
    if (!validRating(rating)) throw new Error("Choose a rating");
    const userId = requireUser();
    const { data, error } = await supabase.from("reflections").insert({ user_id: userId, event_id: event.id, event_title: event.t, category: event.c, district: event.district, rating, answers }).select().single();
    if (error) throw error;
    if (mediaIds.length) {
      const attached = await supabase.from("reflection_media").update({ reflection_id: data.id }).in("id", mediaIds).eq("user_id", userId).is("reflection_id", null);
      if (attached.error) throw attached.error;
    }
    await refreshData();
    return data;
  };
  const saveProfile = async (display_name: string, answers: Json) => {
    const { error } = await supabase.from("profiles").update({ display_name, answers }).eq("id", requireUser());
    if (error) throw error;
    await refreshData();
  };
  const signOut = async () => {
    await queryClient.cancelQueries(); queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    await router.navigate({ to: "/auth", replace: true });
  };
  const deleteMemory = async (id: string) => {
    const { error } = await supabase.from("memories").delete().eq("id", id).eq("user_id", requireUser());
    if (error) throw error;
    await refreshData();
  };
  return { user, authReady, data: user ? query.data ?? empty : empty, loading: !!user && query.isPending, error: query.error, refreshData, upload, makeMemory, saveReflection, saveProfile, signOut, deleteMemory };
}
type PersonalState = ReturnType<typeof usePersonalState>;
const PersonalContext = createContext<PersonalState | null>(null);
export function PersonalProvider({ children }: { children: ReactNode }) { const value = usePersonalState(); return <PersonalContext.Provider value={value}>{children}</PersonalContext.Provider>; }
export function usePersonalData() { const context = useContext(PersonalContext); if (!context) throw new Error("PersonalProvider missing"); return context; }