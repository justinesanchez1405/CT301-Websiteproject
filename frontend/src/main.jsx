// The app's starting point: Vite loads this file from index.html.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
// Importing CSS here applies it to the whole app (Vite bundles it for us).
import "./styles.css";

createRoot(document.getElementById("root")).render(
  // StrictMode runs extra checks in development to catch common mistakes. No effect in production.
  <StrictMode>
    {/* BrowserRouter watches the address bar so React can show the right page for each URL.
        basename tells it the site may live in a sub-folder (see "base" in vite.config.js),
        so "/team" means ".../CT301-Websiteproject/team" on GitHub Pages. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
