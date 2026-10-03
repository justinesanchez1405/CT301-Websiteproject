# Tehillim

Tehillim (Hebrew תְּהִלִּים, "praises," the book of Psalms) is a reusable website template for a
church worship and music team. Any team can copy it and edit one settings file
(`site/js/config.js`) to make it their own.

**Live site:** https://justinesanchez1405.github.io/CT301-Websiteproject/

## Deliverables

| What | Where |
|---|---|
| Public website (Phase 1: HTML, CSS, JavaScript) | [`site/`](site/) · [live site](https://justinesanchez1405.github.io/CT301-Websiteproject/) |
| Design document (brand, components, page screenshots, accessibility) | [`docs/design-document.md`](docs/design-document.md) |
| Database design (ER diagram, tables, constraints, business rules) | [`docs/database-design.md`](docs/database-design.md) |
| Database implementation (Django models and migrations, MySQL script) | [`backend/`](backend/) · [`backend/schema.sql`](backend/schema.sql) |
| Product spec (all four phases) | [`docs/SPEC.md`](docs/SPEC.md) |

## Status

- [x] Phase 1: Public site (Home, Meet the team, Songs, Events, Join)
- [x] Database designed and modeled (Phase 3 groundwork). API and login are still to come.
- [ ] Phase 2: Song library and setlists (React)
- [ ] Phase 3: Login, schedule, admin (Django REST Framework, MySQL)
- [ ] Phase 4: Chord transposer, lyrics display, reminders, practice tracks

## Run it locally

- **Website:** open `site/index.html` in a browser (or use VS Code Live Server).
- **Database:** see [`backend/README.md`](backend/README.md).

All names and contact details are fictional demo data. Demo songs are public-domain hymns.
