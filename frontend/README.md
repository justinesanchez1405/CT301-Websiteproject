# Tehillim front end

The React app (Vite + React Router): the public site (Phase 1) and, later, the team portal (Phase 2).

```
npm install      # once, to download the libraries in package.json
npm run dev      # start the dev server, then open the address it prints
npm run build    # make the production version in dist/
npm run lint     # check the code for common mistakes
```

## Make it your team's site

Edit `src/data/settings.json`: church name, city, service and rehearsal times, About text,
email, social links, Spotify playlist link, and the "songs we're learning" list.
Keep `@example.com` emails while testing. (JSON files can't hold comments, so the notes live here.)

## Where things are

- `src/main.jsx`: starts React and the router
- `src/App.jsx`: which page shows for which address
- `src/components/`: shared pieces (Layout, Header, Footer)
- `src/pages/`: one component per page
- `src/styles.css`: brand tokens and all styles
- `public/`: files served as-is (favicon, placeholder images)
