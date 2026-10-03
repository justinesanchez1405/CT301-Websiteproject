# Tehillim

Tehillim (Hebrew תְּהִלִּים, "praises," the book of Psalms) is a reusable website template for a
church worship and music team. Any team can copy it and edit one settings file
to make it their own.

**Live site:** https://justinesanchez1405.github.io/CT301-Websiteproject/

## What's in this repo

| What | Where |
|---|---|
| Public website: HTML prototype, being moved to React in `frontend/` | [`site/`](site/) · [live site](https://justinesanchez1405.github.io/CT301-Websiteproject/) |
| Design document (brand, components, page screenshots, accessibility) | [`docs/design-document.md`](docs/design-document.md) |
| Database design (ER diagram, tables, constraints, business rules) | [`docs/database-design.md`](docs/database-design.md) |
| Database implementation (Django models and migrations, MySQL script) | [`backend/`](backend/) · [`backend/schema.sql`](backend/schema.sql) |
| Product spec (all four phases) | [`docs/SPEC.md`](docs/SPEC.md) |

## Status

- [ ] Phase 1: Public site in React (Vite + React Router). HTML prototype done, React move in progress.
- [ ] Phase 2: Team portal: song library and setlists (mock JSON data)
- [ ] Phase 3: Back end, login, schedule, and admin (Django, Django REST Framework, MySQL).
      The database is already designed and modeled in `backend/`.
- [ ] Phase 4: Chord transposer, lyrics display, reminders, practice tracks

## Run it locally

- **Website (prototype):** open `site/index.html` in a browser. The React version will run with
  `cd frontend && npm install && npm run dev`.
- **Database:** see [`backend/README.md`](backend/README.md).

All names and contact details are fictional demo data. Demo songs are public-domain hymns.
