# Tehillim: Claude Code instructions

Tehillim (Hebrew תְּהִלִּים, "praises," the Hebrew name for the book of Psalms) is a reusable
website template for any church worship and music team. It is not built for one specific
church: each team runs its own copy and swaps in its own details. The full product spec is in `docs/SPEC.md`.
Read the relevant phase in the spec before starting any work. The brand kit in `docs/brand/`
decides how everything looks: read `docs/brand/README.md` before building any page.

## Who you're working with

- Ian is building this as a general template other music teams can use, and learning as he goes.
- He learns best visually and hands-on. Keep explanations short: a few bullets, not paragraphs.
- He wants to understand how each piece connects (front end, back end, database),
  not just receive working code.

## How to work

1. Build one phase at a time, and one feature at a time inside a phase. Never jump ahead.
2. Before coding a feature, post a short plan (3 to 5 lines): which files you'll create or
   change and what each one does. Wait for Ian's OK before writing code.
3. After each feature:
   - Tell Ian exactly how to see it (which file to open or which command to run).
   - Give a "What you just built" recap: 2 to 4 bullets on how it connects to the rest of the site.
   - Suggest a git commit message.
   - Stop and wait before starting the next feature.
4. Only use the tools the current phase calls for. No back end before Phase 3.
5. Write clear, commented code. Comments should explain why, not only what. Ian reads them to learn.
6. Prefer simple, readable solutions over clever ones. Don't add libraries unless the spec
   calls for them or you explain why first.
7. Team-specific details (church name, service times, email, links) must be easy for any
   team to change: keep them in one settings place, never scattered through the code.
   Ship clearly fictional demo values (the spec lists them), `@example.com` emails, and
   placeholder images. Never invent real people, names, or contact details.
8. When Ian asks "why," start with a real-world analogy, then give the technical answer.
9. When an error happens, show how you found the cause so Ian learns to debug.
10. Song lyrics: seed and demo data uses public-domain hymns only. Never paste copyrighted
    lyrics. Each team adds its own songs under its own church's CCLI license.

## Phases

Update these checkboxes and the "Current phase" line as each phase is completed.

- [x] Phase 1: Public site in React (Vite + React Router) in `frontend/`
- [ ] Phase 2: Team portal: song library and setlists (mock JSON data) in `frontend/`
- [ ] Phase 3: Back end, login, schedule, and admin (Django, Django REST Framework, MySQL) in `backend/`
- [ ] Phase 4: Extras (chord transposer, lyrics display, reminders, practice tracks)

Current phase: Phase 2
Note: `backend/` already holds the Phase 3 data model (Django models, migrations, MySQL
script), designed ahead of time. Its API, login, and front-end connection are not built yet.

## Tech stack

| Layer      | Tool                                          | Starts in |
|------------|-----------------------------------------------|-----------|
| Front end  | React (Vite), React Router, CSS               | Phase 1   |
| Back end   | Python, Django, Django REST Framework         | Phase 3   |
| Database   | MySQL (SQLite is fine while first learning)   | Phase 3   |
| Versioning | Git and GitHub                                | Phase 1   |

## Project structure

```
tehillim/
├── CLAUDE.md          this file
├── docs/
│   ├── SPEC.md        full product spec
│   └── brand/         brand kit: brand book, tokens.css, components.css, logos
├── frontend/          React app: public site (Phase 1) and team portal (Phase 2+)
└── backend/           Phase 3+ Django project
```

## Conventions

- Mobile-first and responsive. Most team members will use the site on their phones.
- Semantic HTML and accessibility: alt text, form labels, visible keyboard focus, WCAG AA contrast.
- CSS: start `frontend/src/styles.css` by pasting in `docs/brand/tokens.css`. Use only those
  variables for colors, spacing, radius, and fonts. Never hard-code a hex value.
- Use `docs/brand/components.css` as the reference for how each component should look.
- JavaScript: modern ES6+, `const`/`let`, no jQuery.
- Naming: kebab-case files, camelCase JS variables, PascalCase React components, snake_case Python.
- Secrets go in `.env` and are never committed. Keep a `.env.example` up to date.
- Git: small commits, one per feature, using messages like `feat: add join form validation`.

## Commands

Fill these in as each phase is set up.

- Phases 1 and 2: `cd frontend && npm install && npm run dev`, then open the address it prints
- Phase 3: `cd backend && python manage.py runserver`
