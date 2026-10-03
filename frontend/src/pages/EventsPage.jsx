import EventCard from "../components/EventCard.jsx";
// Demo events. The September one is in the past on purpose, to show auto-hiding working.
// In Phase 3 this list comes from the database via /api/events/ instead.
import events from "../data/events.json";
import { todayIso, upcomingEvents } from "../utils/events.js";

// Read the clock once when the app loads, outside the component, for the same reason
// as the footer year: React expects a component to give the same output every time it draws.
const today = todayIso();

export default function EventsPage() {
  const upcoming = upcomingEvents(events, today);

  return (
    <div className="page container">
      <title>Events · Tehillim</title>
      <h1>Events</h1>
      <p>Upcoming services and special events. Everyone is welcome.</p>

      {upcoming.length === 0 ? (
        <p className="page-note">No upcoming events right now. Check back soon.</p>
      ) : (
        <ul className="event-list">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ul>
      )}
    </div>
  );
}
