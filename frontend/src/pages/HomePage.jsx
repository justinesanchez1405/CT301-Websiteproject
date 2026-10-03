import { Link } from "react-router";
import Selah from "../components/Selah.jsx";
import settings from "../data/settings.json";

// The home page. Same sections as the HTML prototype; team details now come
// straight from settings.json with {curly braces} instead of data-config fill-ins.
export default function HomePage() {
  return (
    <>
      <title>Tehillim, worship and music team</title>

      {/* Hero: the brand's one bold moment. The large Hebrew word appears only here. */}
      <section className="th-hero container" aria-labelledby="hero-title">
        <p className="th-hero__he" lang="he" dir="rtl">
          תְּהִלִּים
        </p>
        <p className="th-hero__meaning">Tehillim: Hebrew for “praises,” the book of Psalms</p>

        <h1 className="th-hero__title" id="hero-title">
          {settings.churchName} worship and music team
        </h1>

        <blockquote className="hero-verse">
          <p className="th-hero__verse">Let every thing that hath breath praise the LORD.</p>
          <cite>Psalm 150:6</cite>
        </blockquote>

        {/* Secondary (outline) buttons. The one pomegranate button is saved for "Join the team".
            <Link> instead of <a>: it switches pages inside React, with no full reload. */}
        <div className="th-hero__actions">
          <Link className="th-btn th-btn--secondary" to="/songs">
            Hear our songs
          </Link>
          <Link className="th-btn th-btn--secondary" to="/events">
            See upcoming events
          </Link>
        </div>
      </section>

      <Selah />

      {/* Two columns on wider screens: when to come, and who we are. */}
      <div className="container home-grid">
        <section className="home-card" aria-labelledby="next-service-title">
          <h2 id="next-service-title">Next service</h2>
          <ul className="home-list">
            {settings.serviceTimes.map((time) => (
              <li key={time}>{time}</li>
            ))}
          </ul>
          <p className="home-card__note">Rehearsal: {settings.rehearsal}</p>
          <Link to="/events">See all events</Link>
        </section>

        <section aria-labelledby="about-title">
          <h2 id="about-title">About Tehillim</h2>
          <p>{settings.aboutText}</p>
        </section>
      </div>

      <Selah />

      <section className="container home-section" aria-labelledby="songs-title">
        <h2 id="songs-title">Songs we sing</h2>
        <p>Listen to our playlist and see which songs we’re learning this month.</p>
        <Link className="th-btn th-btn--secondary" to="/songs">
          Listen to our songs
        </Link>
      </section>

      <Selah />

      <section className="container home-section home-section--last" aria-labelledby="join-title">
        <h2 id="join-title">Sing or play with us</h2>
        <p>Singers, musicians, sound, and projection: there’s a place for you, whatever your experience.</p>
        {/* The page's single pomegranate button: the one action this page exists for. */}
        <Link className="th-btn th-btn--primary" to="/join">
          Join the team
        </Link>
      </section>
    </>
  );
}
