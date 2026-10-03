/*
  events.js: only loaded on events.html
  -------------------------------------
  Shows upcoming services and special events from the `events` array below.
  Past events hide themselves: we compare each event's date with today's date,
  so nobody has to remember to delete old ones.
  (In Phase 3 this list comes from the database via /api/events/ instead.)
*/

// Demo events. Dates use the ISO format YYYY-MM-DD, and times use 24-hour HH:MM.
// That format sorts and compares correctly as plain text, and it's what databases use.
// The September event is in the past on purpose, to show the auto-hiding working.
const events = [
  {
    date: "2026-09-20",
    time: "09:00",
    title: "Sunday service",
    description: "This one is in the past, so it won't appear on the page.",
  },
  {
    date: "2026-10-11",
    time: "09:00",
    title: "Sunday service",
    description: "Morning worship with the full band.",
  },
  {
    date: "2026-10-17",
    time: "16:00",
    title: "Team rehearsal",
    description: "Run-through for Sunday. New songs first, then the full setlist.",
  },
  {
    date: "2026-10-25",
    time: "18:00",
    title: "Night of worship",
    description: "An evening of songs and prayer. Everyone is welcome, bring a friend.",
  },
  {
    date: "2026-12-24",
    time: "19:00",
    title: "Christmas Eve service",
    description: "Carols and candlelight with the choir and band.",
  },
];

// Today's date as "YYYY-MM-DD" in the visitor's own time zone.
// (toISOString() would use UTC, which can be "tomorrow" in the evening in some places.)
function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // months count from 0 in JS
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// "2026-10-11" + "09:00"  ->  "Sunday, October 11" and "9:00 AM"
function formatEventDate(event) {
  const when = new Date(`${event.date}T${event.time}`); // no "Z", so it's read as local time
  return {
    day: when.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    time: when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

function renderEvents() {
  const list = document.getElementById("event-list");
  if (!list) return;

  const today = todayIso();

  // 1. keep events from today onward  2. sort soonest first
  // Because the dates are ISO text, ">=" and localeCompare work like date comparisons.
  const upcoming = events
    .filter((event) => event.date >= today)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  if (upcoming.length === 0) {
    const note = document.createElement("p");
    note.className = "page-note";
    note.textContent = "No upcoming events right now. Check back soon.";
    list.replaceWith(note);
    return;
  }

  upcoming.forEach((event) => {
    const { day, time } = formatEventDate(event);

    const item = document.createElement("li");
    item.className = "event-card";

    // <time datetime="..."> gives machines (calendars, search engines) the exact date.
    const when = document.createElement("time");
    when.className = "event-card__when";
    when.dateTime = `${event.date}T${event.time}`;
    when.textContent = `${day} · ${time}`;

    const title = document.createElement("h2");
    title.className = "event-card__title";
    title.textContent = event.title;

    const description = document.createElement("p");
    description.className = "event-card__description";
    description.textContent = event.description;

    item.append(when, title, description);
    list.append(item);
  });
}

renderEvents();
