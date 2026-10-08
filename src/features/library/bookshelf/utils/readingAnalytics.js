export const READING_GAP_THRESHOLD_DAYS = 15;

const calendarDay = (date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;

const formatDate = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

// Keep short pauses at daily spacing, but replace long pauses with one slot.
export function buildDailyReadingTimeline(readingDays) {
  const sortedDays = [...readingDays].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const timeline = [];

  sortedDays.forEach((day, index) => {
    const date = new Date(day.date);
    if (index > 0) {
      const previousDate = new Date(sortedDays[index - 1].date);
      const gapDays = calendarDay(date) - calendarDay(previousDate) - 1;
      const gapStart = new Date(previousDate);
      gapStart.setDate(gapStart.getDate() + 1);

      if (gapDays > READING_GAP_THRESHOLD_DAYS) {
        const gapEnd = new Date(date);
        gapEnd.setDate(gapEnd.getDate() - 1);
        timeline.push({
          date: gapStart.toDateString(),
          dateFormatted: "//",
          totalMinutes: null,
          sessionCount: 0,
          gapDays,
          gapStart: gapStart.toLocaleDateString("en-US"),
          gapEnd: gapEnd.toLocaleDateString("en-US"),
        });
      } else {
        for (let offset = 0; offset < gapDays; offset += 1) {
          const missingDate = new Date(gapStart);
          missingDate.setDate(missingDate.getDate() + offset);
          timeline.push({
            date: missingDate.toDateString(),
            dateFormatted: formatDate(missingDate),
            totalMinutes: 0,
            sessionCount: 0,
          });
        }
      }
    }

    timeline.push({ ...day, dateFormatted: formatDate(date) });
  });

  return timeline;
}
