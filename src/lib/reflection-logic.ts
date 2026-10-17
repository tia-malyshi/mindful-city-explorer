export type ReflectionSource = { id: string; rating: number; category: string; district: string };
export function reflectionSummary(rows: ReflectionSource[]) {
  return { count: rows.length, average: rows.length ? rows.reduce((sum, row) => sum + row.rating, 0) / rows.length : 0, districts: new Set(rows.map(row => row.district)).size };
}
export function pickMemoryPhotos<T extends { id: string; kind: string }>(items: T[], random = Math.random): T[] {
  const photos = items.filter(item => item.kind === "photo");
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = photos[i], b = photos[j];
    if (a && b) { photos[i] = b; photos[j] = a; }
  }
  return photos.slice(0, 3);
}
export function validRating(value: number) { return Number.isInteger(value) && value >= 1 && value <= 5; }