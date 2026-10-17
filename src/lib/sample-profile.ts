import type { ReflectionRow } from "@/lib/personal-data";

const sampleEvents = [
  { id: 1, title: "Sunset walk, Pole Mokotowskie", category: "Nature", district: "Mokotów", answer: "The trees and evening light helped me slow down." },
  { id: 2, title: "Open swim, Warszawianka", category: "Sport", district: "Mokotów", answer: "Moving in the water gave me fresh energy." },
  { id: 3, title: "Jazz on Old Town square", category: "Culture", district: "Śródmieście", answer: "I enjoyed listening without checking my phone." },
  { id: 4, title: "Run club, Wisła boulevards", category: "Sport", district: "Śródmieście", answer: "It felt good to move at my own pace." },
  { id: 5, title: "Family picnic, Ogród Saski", category: "Social", district: "Śródmieście", answer: "Sharing a quiet afternoon made me feel connected." },
  { id: 6, title: "Board games night, Praga", category: "Social", district: "Praga-Północ", answer: "A new game made starting conversations easier." },
  { id: 9, title: "Library meetup: Polish for newcomers", category: "Social", district: "Wola", answer: "I learned something new and met welcoming people." },
];

// Fixtures are presentation-only: never send these rows to personal-data mutations.
export function generateSampleProfile(random: () => number = Math.random): ReflectionRow[] {
  return sampleEvents.map(event => ({ event, order: random() })).sort((a, b) => a.order - b.order).slice(0, 5).map(({ event }, index) => ({
    id: `sample-profile-${event.id}`, user_id: "sample-only", event_id: event.id,
    event_title: event.title, category: event.category, district: event.district,
    rating: 3 + Math.floor(random() * 3), created_at: `2026-10-${String(16 - index * 2).padStart(2, "0")}T12:00:00Z`,
    answers: { "What stayed with you?": event.answer },
  }));
}