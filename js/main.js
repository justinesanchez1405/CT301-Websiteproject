/*
  main.js: shared behavior for every page
  ---------------------------------------
  1. Fill in team details from config.js
  2. Open and close the mobile menu
  3. Highlight the current page in the nav
  4. Put the current year in the footer

  This file loads with `defer` (see the <script> tags), which means the browser
  runs it only after the whole HTML page is read. So every element we look for
  already exists, and we don't need to wait for a "DOMContentLoaded" event.
*/

// ---------------------------------------------------------------------------
// 1. Team details
// ---------------------------------------------------------------------------
// The HTML marks empty spots with data attributes, e.g. <span data-config="churchName">.
// We find each spot and drop in the matching value from siteConfig.
// Keeping data (config.js) separate from layout (HTML) means a team never edits the pages.
function fillTeamDetails() {
  // Plain text values: churchName, city, rehearsal...
  document.querySelectorAll("[data-config]").forEach((element) => {
    const key = element.dataset.config; // "churchName" from data-config="churchName"
    // textContent (not innerHTML) so settings are always treated as plain text, never as code.
    element.textContent = siteConfig[key] ?? "";
  });

  // Service times are a list, so we build one <li> per time.
  document.querySelectorAll("[data-config-list='serviceTimes']").forEach((list) => {
    siteConfig.serviceTimes.forEach((time) => {
      const item = document.createElement("li");
      item.textContent = time;
      list.append(item);
    });
  });

  // Email needs both the visible text and a mailto: link.
  document.querySelectorAll("[data-config-email]").forEach((link) => {
    link.textContent = siteConfig.email;
    link.href = `mailto:${siteConfig.email}`;
  });

  // Social links: one <li><a> per entry.
  document.querySelectorAll("[data-config-social]").forEach((list) => {
    siteConfig.socialLinks.forEach(({ label, url }) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.textContent = label;
      link.href = url;
      item.append(link);
      list.append(item);
    });
  });
}

// ---------------------------------------------------------------------------
// 2. Mobile menu
// ---------------------------------------------------------------------------
// On phones the nav is hidden behind the "Menu" button (the CSS decides that).
// aria-expanded tells screen readers whether the menu is open, so we keep it in
// sync with what sighted users see. We use a real <button>, which already works
// with Enter, Space, and touch, so there's no extra keyboard code to write.
function setupMenuToggle() {
  const button = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  function setOpen(isOpen) {
    button.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("is-open", isOpen);
  }

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // Escape closes the menu and puts focus back on the button,
  // so keyboard users don't lose their place.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });
}

// ---------------------------------------------------------------------------
// 3. Current page highlight
// ---------------------------------------------------------------------------
// Compare the file name in the address bar (e.g. "team.html") with each nav link.
// The matching link gets aria-current="page". The CSS styles that attribute, and
// screen readers announce it as "current page", so one attribute serves both.
function highlightCurrentPage() {
  // "/site/team.html" -> "team.html". A bare "/" (folder root) means the home page.
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".th-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentFile) {
      link.setAttribute("aria-current", "page");
    }
  });
}

// ---------------------------------------------------------------------------
// 4. Footer year
// ---------------------------------------------------------------------------
// Set by JavaScript so the copyright year never goes out of date.
function setFooterYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

fillTeamDetails();
setupMenuToggle();
highlightCurrentPage();
setFooterYear();
