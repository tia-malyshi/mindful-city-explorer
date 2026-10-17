import { expect, it } from "vitest";
import { pickMemoryPhotos, reflectionSummary, validRating } from "@/lib/reflection-logic";
it("creates memories only from photos, preserving original IDs", () => {
  const photos = pickMemoryPhotos([{ id: "quest-photo", kind: "photo" }, { id: "spoken-answer", kind: "voice" }, { id: "reflection-photo", kind: "photo" }], () => 0);
  expect(photos.map(photo => photo.id)).toEqual(["reflection-photo", "quest-photo"]);
});
it("builds experience statistics from saved ratings and districts", () => {
  expect(reflectionSummary([{ id: "a", rating: 5, district: "Mokotów", category: "Nature" }, { id: "b", rating: 3, district: "Wola", category: "Social" }])).toEqual({ count: 2, average: 4, districts: 2 });
});
it("accepts ratings from one to five, not missing or fractional ratings", () => { expect(validRating(1)).toBe(true); expect(validRating(5)).toBe(true); expect(validRating(0)).toBe(false); expect(validRating(6)).toBe(false); expect(validRating(2.5)).toBe(false); });