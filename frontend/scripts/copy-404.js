// Runs after `vite build` (see "build" in package.json).
//
// Why: GitHub Pages only knows about real files. If someone refreshes on
// .../CT301-Websiteproject/team, GitHub looks for a file called "team", finds none,
// and shows its 404 page. But if a 404.html exists, GitHub shows that instead.
// So we make 404.html a copy of the app's index.html: the app loads, React Router
// reads "/team" from the address bar, and the right page appears.
import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "dist/404.html");
console.log("Copied dist/index.html to dist/404.html for GitHub Pages.");
