import { formatEventDate } from "../utils/events.js";

// One upcoming event: date and time, title, description.
export default function EventCard({ event }) {
  const { day, time } = formatEventDate(event);

  return (
    <li className="event-card">
      {/* <time dateTime="..."> gives machines (calendars, search engines) the exact date. */}
      <time className="event-card__when" dateTime={`${event.date}T${event.time}`}>
        {day} · {time}
      </time>
      <h2 className="event-card__title">{event.title}</h2>
      <p className="event-card__description">{event.description}</p>
    </li>
  );
}
