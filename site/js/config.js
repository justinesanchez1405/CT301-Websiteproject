/*
  Tehillim team settings
  ----------------------
  This is the ONE file a team edits to make the site their own.
  Every page reads from it (through main.js), so changing a value here
  updates the header, footer, and pages everywhere at once.

  The values below are fictional demo data. Replace them with your team's details.
  Keep emails on @example.com while testing so no real inbox gets messages.
*/

// `const` at the top level of a normal <script> is shared with the scripts loaded
// after it on the same page. That's how main.js can read `siteConfig`.
const siteConfig = {
  churchName: "Cedar Hill Church", // fictional demo church
  city: "Springfield",

  // A list, because many churches hold more than one Sunday service.
  serviceTimes: ["Sundays at 9:00 AM", "Sundays at 11:00 AM"],

  // Not shown yet. The home page's "Next service" block uses it in a later feature.
  rehearsal: "Saturdays at 4:00 PM",

  // The "About Tehillim" paragraph on the home page. Two or three sentences in your own words.
  aboutText:
    "We’re the singers, musicians, and tech crew who lead worship each Sunday. " +
    "We rehearse together every week, pray for one another, and love helping the whole church sing.",

  email: "worship@example.com",

  // "#" means "no link yet". Swap in your real page addresses.
  socialLinks: [
    { label: "Facebook", url: "#" },
    { label: "YouTube", url: "#" },
    { label: "Instagram", url: "#" },
  ],

  // Leave empty until you have a playlist. The Songs page (a later feature)
  // will show a "Playlist coming soon" note instead of an empty embed.
  spotifyPlaylistUrl: "",

  // "Songs we're learning this month" on the Songs page. Add, remove, or reorder freely.
  // Demo list: public-domain hymns only. Titles and authors are fine to show,
  // but never paste copyrighted lyrics anywhere on the site.
  learningSongs: [
    { title: "Amazing Grace", artist: "John Newton" },
    { title: "Be Thou My Vision", artist: "Traditional Irish, translated by Mary Byrne" },
    { title: "It Is Well with My Soul", artist: "Horatio Spafford" },
    { title: "Holy, Holy, Holy", artist: "Reginald Heber" },
  ],
};
