import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildDailyReadingTimeline } from "./readingAnalytics.js";

const readingDay = (year, month, day, totalMinutes = 30) => ({
  date: new Date(year, month - 1, day).toDateString(),
  totalMinutes,
  sessionCount: 1,
});

test("empty and single-day histories have no artificial gaps", () => {
  assert.deepEqual(buildDailyReadingTimeline([]), []);
  const timeline = buildDailyReadingTimeline([readingDay(2026, 1, 1)]);
  assert.equal(timeline.length, 1);
  assert.equal(timeline[0].totalMinutes, 30);
});

test("exactly 15 days without reading retain daily spacing", () => {
  const timeline = buildDailyReadingTimeline([
    readingDay(2026, 1, 1),
    readingDay(2026, 1, 17),
  ]);
  assert.equal(timeline.length, 17);
  assert.equal(timeline.filter((day) => day.totalMinutes === 0).length, 15);
  assert.ok(timeline.every((day) => !day.gapDays));
});

test("16 days without reading collapse to a single null-valued slot", () => {
  const timeline = buildDailyReadingTimeline([
    readingDay(2026, 1, 1),
    readingDay(2026, 1, 18, 45),
  ]);
  assert.equal(timeline.length, 3);
  assert.equal(timeline[1].gapDays, 16);
  assert.equal(timeline[1].totalMinutes, null);
  assert.equal(timeline[1].gapStart, "1/2/2026");
  assert.equal(timeline[1].gapEnd, "1/17/2026");
  assert.equal(timeline[2].totalMinutes, 45);
});

test("each long pause collapses while shorter pauses remain", () => {
  const input = [
    readingDay(2026, 3, 1),
    readingDay(2026, 1, 20),
    readingDay(2026, 1, 1),
    readingDay(2026, 1, 22),
  ];
  const original = structuredClone(input);
  const timeline = buildDailyReadingTimeline(input);
  assert.deepEqual(timeline.filter((day) => day.gapDays).map((day) => day.gapDays), [18, 37]);
  assert.equal(timeline.filter((day) => day.totalMinutes === 0).length, 1);
  assert.equal(timeline.reduce((sum, day) => sum + day.totalMinutes, 0), 120);
  assert.deepEqual(input, original);
});

test("calendar-day counting works across DST, leap days and year boundaries", () => {
  for (const [start, end, expected] of [
    [readingDay(2026, 3, 1), readingDay(2026, 3, 18), 16],
    [readingDay(2024, 2, 20), readingDay(2024, 3, 10), 18],
    [readingDay(2025, 12, 20), readingDay(2026, 1, 10), 20],
  ]) {
    const timeline = buildDailyReadingTimeline([start, end]);
    assert.equal(timeline.length, 3);
    assert.equal(timeline[1].gapDays, expected);
    assert.equal(new Set(timeline.map((day) => day.date)).size, 3);
  }
});

test("the requested book's history preserves totals and compresses a resumed reading after months", () => {
  const entries = JSON.parse(readFileSync(new URL("../../../../static/books/toggl-data.json", import.meta.url), "utf8"))
    .filter((entry) => entry.description?.includes("清心志于一事"));
  assert.ok(entries.length > 0);
  const days = new Map();
  for (const entry of entries) {
    const date = new Date(entry.start).toDateString();
    const day = days.get(date) ?? { date, totalMinutes: 0, sessionCount: 0 };
    day.totalMinutes += entry.dur / 60000;
    day.sessionCount += 1;
    days.set(date, day);
  }
  const timeline = buildDailyReadingTimeline([...days.values()]);
  // The local export ends in May; model the October resumption in the screenshot.
  const resumedTimeline = buildDailyReadingTimeline([
    ...days.values(),
    readingDay(2026, 10, 7, 100),
  ]);
  const gaps = resumedTimeline.filter((day) => day.gapDays);
  assert.ok(gaps.some((gap) => gap.gapDays > 100));
  assert.equal(timeline.filter((day) => day.sessionCount > 0).length, days.size);
  assert.equal(timeline.reduce((sum, day) => sum + day.totalMinutes, 0), [...days.values()].reduce((sum, day) => sum + day.totalMinutes, 0));
  assert.equal(timeline.reduce((sum, day) => sum + day.sessionCount, 0), entries.length);
});
