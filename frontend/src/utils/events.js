// Date logic for the Events page, moved from the HTML prototype (site/js/events.js).
// Plain JavaScript with no React, so it's easy to reuse and test.

// Today's date as "YYYY-MM-DD" in the visitor's own time zone.
// (toISOString() would use UTC, which can be "tomorrow" in the evening in some places.)
export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // months count from 0 in JS
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Keep events from `today` onward, soonest first.
// `today` is passed in rather than read from the clock inside, which makes this a
// "pure" function: same inputs, same answer, every time. That's what lets React call
// it safely while drawing, and what makes it easy to test with any date we like.
// Dates are ISO text ("2026-10-11"), so ">=" and localeCompare work like date comparisons.
export function upcomingEvents(events, today) {
  return events
    .filter((event) => event.date >= today)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

// "2026-10-11" + "09:00"  ->  { day: "Sunday, October 11", time: "9:00 AM" }
export function formatEventDate(event) {
  const when = new Date(`${event.date}T${event.time}`); // no "Z", so it's read as local time
  return {
    day: when.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    time: when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}
