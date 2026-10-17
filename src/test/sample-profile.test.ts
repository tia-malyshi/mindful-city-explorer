import { expect, it } from "vitest";
import { generateSampleProfile } from "@/lib/sample-profile";
import { profileInterests } from "@/lib/profile-interests";

it("generates five distinct example events with ratings and reflection answers", () => {
  const samples = generateSampleProfile(() => 0.5);
  expect(samples).toHaveLength(5);
  expect(new Set(samples.map(item => item.event_id)).size).toBe(5);
  expect(samples.map(item => item.rating)).toEqual([4, 4, 4, 4, 4]);
  expect(samples[0]?.answers).toEqual({ "What stayed with you?": "The trees and evening light helped me slow down." });
  expect(samples.every(item => item.id.startsWith("sample-profile-") && item.user_id === "sample-only")).toBe(true);
  expect(profileInterests([], samples).reduce((sum, group) => sum + group.events.length, 0)).toBe(5);
});

it("changes generated ratings with the supplied random source", () => {
  expect(generateSampleProfile(() => 0).map(item => item.rating)).toEqual([3, 3, 3, 3, 3]);
  expect(generateSampleProfile(() => 0.99).map(item => item.rating)).toEqual([5, 5, 5, 5, 5]);
});