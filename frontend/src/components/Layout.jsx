import { Outlet } from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

// The frame around every page. In the HTML prototype the header and footer were
// copy-pasted into all five files; now they're written once, here.
export default function Layout() {
  return (
    <>
      {/* "Skip to main content": lets keyboard users jump past the nav. */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        {/* Outlet = "put the current page here" (HomePage, TeamPage, ...). */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
