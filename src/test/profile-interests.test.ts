import { expect, it } from "vitest";
import { profileInterests } from "@/lib/profile-interests";

it("uses actual questionnaire interests without inventing activity history", () => {
  const groups = profileInterests([{ question: "What interests you?", values: ["Photography", "Music & concerts"] }], []);
  expect(groups.find(group => group.name === "Nature")?.selected).toEqual(["Photography"]);
  expect(groups.find(group => group.name === "Culture")?.selected).toEqual(["Music & concerts"]);
  expect(groups.reduce((sum, group) => sum + group.events.length, 0)).toBe(0);
});
it("connects each saved experience to its actual category", () => {
  const groups = profileInterests([], [{ id: "saved-1", category: "Sport", event_title: "Swimming" }]);
  expect(groups.find(group => group.name === "Sport")?.events.map(event => event.id)).toEqual(["saved-1"]);
  expect(groups.find(group => group.name === "Nature")?.events).toEqual([]);
});