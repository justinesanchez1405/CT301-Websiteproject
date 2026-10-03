// Team details come straight from the settings file. Vite lets us import JSON
// like a JavaScript object, so there's no fill-in code like the prototype's main.js.
import settings from "../data/settings.json";

// Worked out once when the app loads, so the year never goes out of date.
// It lives outside the component on purpose: React expects a component to give the
// same output every time it draws, and reading the clock inside it breaks that rule
// (the linter flags it as "impure").
const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <p className="site-footer__church">{settings.churchName}</p>
            <p>{settings.city}</p>
          </div>

          <div>
            <h2 className="site-footer__heading">Services</h2>
            <ul>
              {/* One <li> per service time. React needs a unique "key" on each item
                  in a list so it can tell them apart when the list changes. */}
              {settings.serviceTimes.map((time) => (
                <li key={time}>{time}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="site-footer__heading">Contact</h2>
            <p>
              <a className="site-footer__email" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
            <ul className="site-footer__links" aria-label="Social media">
              {settings.socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.url}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="site-footer__small">
          © {year} {settings.churchName} worship team. Built with Tehillim.
        </p>
      </div>
    </footer>
  );
}
