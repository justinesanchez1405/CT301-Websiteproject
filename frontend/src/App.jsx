import { Routes, Route } from "react-router";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import SongsPage from "./pages/SongsPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import JoinPage from "./pages/JoinPage.jsx";

// The map of the site: which component to show for which address.
// In the HTML prototype, this "map" was the five separate .html files.
export default function App() {
  return (
    <Routes>
      {/* Every page sits INSIDE Layout, so they all share one header and footer.
          Layout shows the matching page where it puts <Outlet />. */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="songs" element={<SongsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="join" element={<JoinPage />} />
      </Route>
    </Routes>
  );
}
