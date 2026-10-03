import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";

// The nav links, as data. Adding a page later means adding one line here.
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/team", label: "Meet the team" },
  { to: "/songs", label: "Songs" },
  { to: "/events", label: "Events" },
  { to: "/join", label: "Join" },
];

export default function Header() {
  // State: is the phone menu open? When it changes, React redraws the header.
  // (In the HTML prototype we changed classes and attributes by hand in main.js.)
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape closes the menu. The effect adds the key listener when the menu opens,
  // and its cleanup function removes it again, so we never pile up listeners.
  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("menu-button")?.focus(); // keep keyboard users' place
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="th-header container">
        <Link className="th-wordmark" to="/" aria-label="Tehillim, home">
          <span className="th-wordmark__latin">Tehillim</span>
          <span className="th-wordmark__rule" aria-hidden="true"></span>
          {/* Hebrew reads right to left: lang and dir tell the browser and screen readers. */}
          <span className="th-wordmark__he" lang="he" dir="rtl">
            תְּהִלִּים
          </span>
        </Link>

        <button
          id="menu-button"
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {/* Lucide "menu" icon. aria-hidden because the word "Menu" already says what it does. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          Menu
        </button>

        {/* The class decides whether CSS shows the nav on phones. */}
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} id="site-nav" aria-label="Main">
          <ul className="th-nav">
            {navLinks.map((link) => (
              <li key={link.to}>
                {/* NavLink adds aria-current="page" to the link for the page you're on,
                    which our CSS already styles. "end" stops "/" matching every page.
                    onClick closes the phone menu: in the HTML prototype each click loaded a
                    whole new page, which reset the menu for free. In React the header stays
                    on screen between pages, so we close it ourselves. */}
                <NavLink to={link.to} end={link.to === "/"} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
