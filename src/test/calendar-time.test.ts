import { expect, it } from "vitest";
import { calendarMinutes } from "@/lib/calendar-time";
it("positions a proposed 18:30 activity at half past six in the evening", () => { expect(calendarMinutes("18:30")).toBe(1110); });
it("keeps activities without a time out of the hourly grid", () => { expect(calendarMinutes("Any")).toBeNull(); });