import type { ProfileAnswer } from "@/components/profile-menu";

export const interestGroups = [
  { name: "Nature", tone: "sage", values: ["Nature & walks", "Photography"] },
  { name: "Sport", tone: "sky", values: ["Sports & fitness", "Dance", "Mindfulness"] },
  { name: "Culture", tone: "rose", values: ["Art & museums", "Music & concerts", "History & architecture"] },
  { name: "Social", tone: "sun", values: ["Board games", "Volunteering"] },
  { name: "Food & cafés", tone: "accent", values: ["Food & cafés"] },
  { name: "Learning", tone: "violet", values: ["Books & writing", "Crafts & workshops", "Science & technology"] },
] as const;

export function profileInterests<T extends { category: string; event_title: string; id: string }>(answers: ProfileAnswer[], reflections: T[]) {
  const selected = new Set(answers.find(answer => answer.question === "What interests you?")?.values ?? []);
  return interestGroups.map(group => ({
    ...group,
    selected: group.values.filter(value => selected.has(value)),
    events: reflections.filter(item => item.category === group.name),
  })).map(group => ({ ...group, weight: group.selected.length + group.events.length }));
}