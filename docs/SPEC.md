# Tehillim: product spec

## 1. Overview

Tehillim is a reusable website template for a church worship and music team. It is not
tied to one church: any team can take a copy, change one settings file, and have its own
site. It has two sides:

- A public site where the congregation and visitors can learn about the team, hear the
  songs we sing, see upcoming services, and apply to join.
- A private team portal where members find songs, chord charts, setlists, and their serving
  schedule, and where the worship leader plans each Sunday.

Goals:

1. Replace scattered group-chat messages and spreadsheets with one place to plan Sundays.
2. Help members prepare: right song, right key, right arrangement, before rehearsal.
3. Build in phases, so each phase gives the team something usable on its own.

## 2. Team details (customizable)

Every team-specific detail lives in one settings place, so a new team changes one file
instead of hunting through every page. The template ships with these clearly fictional
demo values:

| Detail                 | Demo value                                     |
|------------------------|------------------------------------------------|
| Church name            | Cedar Hill Church (fictional)                  |
| City / location        | Springfield                                    |
| Sunday service time(s) | 9:00 AM and 11:00 AM                           |
| Rehearsal day and time | Saturday 4:00 PM                               |
| Team contact email     | worship@example.com                            |
| Social links           | `#` (empty links until a team adds its own)    |
| Spotify playlist link  | Empty: show a "Playlist coming soon" note      |
| Logo                   | Tehillim text wordmark (from the brand kit)    |
| Team members           | "Member name" placeholders with placeholder photos |

Rules for demo data: `@example.com` emails only, no real people, public-domain hymns only.

Where the settings live, by phase:

- Phase 1: `site/js/config.js`, read by `main.js` to fill in the header, footer, and pages.
- Phase 2: a settings JSON file in `frontend/src/data/`.
- Phase 3: environment variables or a settings model the leader can edit.

## 3. Users and roles

| Role            | Who                                   | Can do                                                                                   |
|-----------------|---------------------------------------|------------------------------------------------------------------------------------------|
| Visitor         | Anyone, no login                      | View public pages, listen to playlist, submit the Join form                              |
| Team member     | Singers, musicians, sound, projection | Everything a visitor can, plus: song library, setlists, own schedule, availability, announcements |
| Worship leader  | Team leader(s), admin                 | Everything a member can, plus: manage songs, build setlists, assign roster, manage members, review join requests, post announcements |

Team positions: Worship leader, Vocals, Keys, Acoustic guitar, Electric guitar, Bass, Drums,
Sound, Lyrics/Projection. A member can hold more than one position.

## 4. Visual direction

The brand kit in `docs/brand/` is the source of truth for every visual decision. Read
`docs/brand/README.md` before building any page.

| File                        | What it is                                                     |
|-----------------------------|----------------------------------------------------------------|
| `docs/brand/README.md`      | The brand book: voice, logo rules, color roles, type, layout   |
| `docs/brand/tokens.css`     | Every color, spacing, radius, and font token as CSS variables  |
| `docs/brand/tokens.json`    | The same tokens as data (useful in React and Django later)     |
| `docs/brand/components.css` | Reference CSS for each component (classes prefixed `th-`)      |
| `docs/brand/logos/`         | SVG logos: stacked, horizontal, on-night, and the app mark     |

Quick reference:

- Colors: `--tekhelet` (brand blue), `--ink`, `--pomegranate` (one main action per view),
  `--brass` (thin details only), `--surface` (cool linen background).
- Two themes: Day (default) and Night watch (dark mode and the stage lyrics display),
  switched with `data-theme="dark"` on `<html>`.
- Type: Frank Ruhl Libre for headings, scripture, and Hebrew; Assistant for everything else.
- Signature: the Hebrew word תְּהִלִּים set large in the home hero (once per site), and the
  "Selah" divider between public page sections. Lines, not shadows. No gradients.

Verses (King James Version, public domain):

- Home hero: "Let every thing that hath breath praise the LORD." (Psalm 150:6)
- Join page: "Sing unto him a new song; play skilfully with a loud noise." (Psalm 33:3)

Copy tone: warm, plain, and welcoming. Sentence case for headings and buttons. Buttons say
exactly what they do ("Send application", not "Submit").

## 5. Phase 1: Public site

Tools: HTML, CSS, vanilla JavaScript. Folder: `site/`. No frameworks, no build step.

### File structure

```
site/
├── index.html
├── team.html
├── songs.html
├── events.html
├── join.html
├── css/styles.css
├── js/
│   ├── main.js        shared: mobile nav toggle, current-page highlight, footer year
│   ├── team.js        renders team cards from a data array
│   ├── events.js      renders upcoming events from a data array
│   └── join.js        form validation
└── assets/images/
```

### Shared layout (every page)

- Header: Tehillim wordmark (links home) and nav: Home, Meet the team, Songs, Events, Join.
- On phones, the nav collapses behind a menu button (toggle with JavaScript, accessible:
  `aria-expanded`, keyboard operable).
- The current page is highlighted in the nav.
- Footer: church name, service times, contact email, social links, current year (set by JS).

### Pages

Home (`index.html`)
- Hero with the Hebrew wordmark, meaning, and Psalm 150:6.
- "Next service" block: day and time from Project details.
- Short "About Tehillim" (2 to 3 sentences, placeholder copy marked TODO).
- Preview of the Songs page (embedded playlist or link).
- Call to action: "Join the team" linking to the Join page.

Meet the team (`team.html`)
- Member cards: photo (placeholder image), name, position(s).
- Group cards by position (Vocals, Band, Tech).
- Cards are rendered from a JavaScript array in `team.js` (teaches DOM manipulation).
  Use clearly fake placeholder names like "Member name"; each team replaces them with its own.

Songs (`songs.html`)
- Embedded Spotify playlist (iframe) using the link from Project details.
- "Songs we're learning this month": a short list (title and artist).

Events (`events.html`)
- Upcoming services and special events rendered from a JavaScript array in `events.js`.
- Each event: date, time, title, short description.
- Past events are automatically hidden by comparing dates in JavaScript.

Join the team (`join.html`)
- Psalm 33:3 at the top and a short welcome.
- Form fields: full name (required), email (required, valid format), phone (optional),
  positions interested in (checkboxes, at least one), experience level (radio:
  beginner, some experience, experienced), message (optional, max 500 characters).
- Validation in `join.js`: inline error messages next to each field, errors clear as the
  user fixes them, focus moves to the first invalid field on submit.
- On a valid submit, show a confirmation message on the page. Phase 1 does not save the
  data. Log it to the console and add a `TODO:` noting it connects to the back end in Phase 3.

### Phase 1 done when

- All five pages exist, link to each other, and share the same header and footer.
- Layout works from 360px phone width up to desktop.
- Mobile nav works with mouse, touch, and keyboard.
- Team and events render from JavaScript arrays.
- Join form validates every rule above.
- No console errors. Images have alt text. Contrast passes WCAG AA.

## 6. Phase 2: Song library and setlists (React)

Tools: React with Vite, React Router. Folder: `frontend/`. Data comes from mock JSON files
in `src/data/` (the real back end replaces these in Phase 3).

### Steps

1. Create the Vite React app in `frontend/`.
2. Rebuild the five public pages as React components, reusing Phase 1's design and CSS tokens.
   Keep `site/` as a reference. Point out to Ian how HTML pages became components.
3. Add the team portal pages below using mock data.

### Routes

| Path                       | Page                          |
|----------------------------|-------------------------------|
| `/`                        | Home                          |
| `/team`                    | Meet the team                 |
| `/songs`                   | Songs                         |
| `/events`                  | Events                        |
| `/join`                    | Join the team                 |
| `/portal`                  | Portal home (this week's service, my next assignment, latest announcement) |
| `/portal/library`          | Song library                  |
| `/portal/library/:songId`  | Song detail                   |
| `/portal/setlists`         | Upcoming setlists             |
| `/portal/setlists/:serviceId` | Setlist detail             |

In Phase 2 the portal is not protected. Add a visible "Demo mode" banner in the portal so
it's clear login comes in Phase 3.

### Suggested components

`Layout`, `Header`, `Footer`, `PortalLayout`, `SongCard`, `SongList`, `SongFilters`,
`ChordChart`, `SetlistCard`, `SetlistItem`, `EmptyState`.

### Mock data shapes

`src/data/songs.json`
```json
[
  {
    "id": 1,
    "title": "Amazing Grace",
    "author": "John Newton",
    "defaultKey": "G",
    "tempoBpm": 72,
    "timeSignature": "3/4",
    "tags": ["hymn", "grace"],
    "youtubeUrl": "",
    "ccliNumber": "",
    "chordpro": "{title: Amazing Grace}\n[G]Amazing [G7]grace, how [C]sweet the [G]sound"
  }
]
```

`src/data/services.json`
```json
[
  {
    "id": 1,
    "date": "2026-10-11",
    "startTime": "09:00",
    "title": "Sunday service",
    "setlist": [
      { "songId": 1, "order": 1, "key": "G", "notes": "Start soft, keys only" }
    ]
  }
]
```

Seed 6 to 8 public-domain hymns, for example: Amazing Grace, Holy Holy Holy, Be Thou My
Vision, It Is Well with My Soul, Come Thou Fount of Every Blessing, and Crown Him with Many
Crowns. Confirm each seeded song is in the public domain before adding it.

### Features

Song library
- Search by title or author as you type.
- Filter by key and by tag.
- Each card shows title, author, key, and tempo.

Song detail
- Song info: key, tempo, time signature, author, reference video (embedded if provided).
- Chord chart rendered from ChordPro: chords sit above the matching lyric syllable.
  Write a small parser function and explain how it works.

Setlists
- List of upcoming services, each showing date, title, and song count.
- Setlist detail: songs in order with the key for that service and any notes.
  Each song links to its detail page.

### Phase 2 done when

- All public pages work as React components with React Router.
- Library search and filters work together.
- ChordPro charts render correctly, including lines with no chords.
- Setlists link to songs and show the service key.
- Responsive and accessible to the same standard as Phase 1.

## 7. Phase 3: Back end, login, schedule, admin

Tools: Python, Django, Django REST Framework (DRF), MySQL. Folder: `backend/`.
SQLite is acceptable for the first steps; switch to MySQL before Phase 3 is complete.

### Django apps

- `accounts`: profiles, positions, login
- `music`: songs
- `scheduling`: services, setlist items, assignments, blockouts
- `community`: announcements, join requests

### Data model

| Model         | Fields                                                                                 |
|---------------|----------------------------------------------------------------------------------------|
| User          | Django's built-in user (username, email, password, first and last name)                |
| Profile       | user (one-to-one), phone, photo, positions (many-to-many Position), is_leader          |
| Position      | name                                                                                   |
| Song          | title, author, default_key, tempo_bpm, time_signature, chordpro, youtube_url, ccli_number, tags, created_at |
| Service       | date, start_time, title, service_type (sunday, rehearsal, special), notes, is_public   |
| SetlistItem   | service (FK), song (FK), order, key, notes                                             |
| Assignment    | service (FK), user (FK), position (FK), status (pending, confirmed, declined)          |
| Blockout      | user (FK), start_date, end_date, note                                                  |
| Announcement  | title, body, author (FK), pinned, created_at                                           |
| JoinRequest   | name, email, phone, positions_interested, experience, message, status (new, contacted, approved, declined), created_at |

Before building, draw this as an ER diagram (Mermaid in a markdown file) and walk Ian
through the relationships.

### API endpoints

Public (no login)
- `GET  /api/events/` public services only (`is_public=True`, upcoming)
- `POST /api/join-requests/`

Auth
- `POST /api/auth/login/`, `POST /api/auth/logout/`, `GET /api/auth/me/`

Team members (logged in)
- `GET /api/songs/`, `GET /api/songs/:id/`
- `GET /api/services/`, `GET /api/services/:id/` (includes setlist and assignments)
- `GET /api/my-assignments/`, `PATCH /api/assignments/:id/` (confirm or decline own only)
- `GET /api/blockouts/` (own), `POST /api/blockouts/`, `DELETE /api/blockouts/:id/`
- `GET /api/announcements/`

Worship leader only
- Full create, update, delete on songs, services, setlist items, assignments, announcements
- `GET /api/members/`, update member positions and leader status
- `GET /api/join-requests/`, `PATCH /api/join-requests/:id/`

Auth approach: Django session authentication with CSRF protection, with the React dev server
proxying `/api` to Django so they share an origin. Explain to Ian why this is simpler than
tokens for a beginner. Enable the Django admin as a backup tool for the leader.

### Connecting the front end

- Replace each mock JSON import with a `fetch` call to the API, one feature at a time.
- Add a login page at `/login`. Protect `/portal/*` routes; redirect to login if not signed in.
- Show leader-only controls only to leaders, and enforce the same rules on the server.
- The Join form now posts to `/api/join-requests/`.
- The Events page now reads from `/api/events/`.

### New portal pages

| Path                         | Page                                                            |
|------------------------------|-----------------------------------------------------------------|
| `/portal/schedule`           | My schedule: my assignments with confirm and decline buttons    |
| `/portal/availability`       | My blockout dates: add and remove                               |
| `/portal/announcements`      | Team announcements, pinned first                                |
| `/portal/admin/songs`        | Leader: add and edit songs                                      |
| `/portal/admin/services`     | Leader: create services and build setlists (add, remove, reorder songs, set key) |
| `/portal/admin/roster`       | Leader: assign members to positions for each service            |
| `/portal/admin/members`      | Leader: manage members and positions                            |
| `/portal/admin/join-requests`| Leader: review and update join requests                         |

Roster rules: when assigning someone, warn if they have a blockout on that date or are
already assigned to that service.

### Phase 3 done when

- Members can log in and out. Portal routes are protected.
- Permissions are enforced on the server, not only hidden in the UI.
- All mock data is replaced with API data.
- The leader can create a service, build its setlist, and assign the roster end to end.
- Join requests submitted on the public site appear for the leader.
- Running on MySQL with migrations committed. Secrets in `.env`.
- Basic tests for permissions and the roster conflict check.

## 8. Phase 4: Extras

Build each as its own feature, in this order:

1. Chord transposer: on song detail, buttons to move the key up or down a semitone; all
   chords shift, including sharps, flats, minor chords, and slash chords (like `G/B`).
   Write it as a pure function with tests.
2. Lyrics display: a full-screen, large-text view of a setlist for a projector or a tablet
   on stage. Arrow keys move between song sections. High-contrast dark theme.
3. Reminders: email the members assigned to a service a set number of days before. Use a
   Django management command and Django's console email backend in development.
4. Practice tracks: attach audio links or uploads to a song, labeled by part
   (for example "Alto", "Bass guitar").

## 9. Quality standards (all phases)

- Accessibility: semantic HTML, labels on every input, visible focus states, keyboard
  navigation, alt text, WCAG AA color contrast, respects `prefers-reduced-motion`.
- Responsive: test at 360px, 768px, and 1280px widths.
- Performance: optimized images, no unused libraries.
- Security (Phase 3+): no secrets in code, server-side permission checks, CSRF protection,
  validate all input on the server.
- Browsers: latest Chrome, Safari, Firefox, and Edge, including mobile Safari and Chrome.

## 10. Deployment (decide later)

- Phase 1: static hosting such as GitHub Pages or Netlify.
- Phase 3: pick a host that supports Django and MySQL when we get there. Not needed now.

## 11. Out of scope for now

Online giving, livestream hosting, a native mobile app, and hosting multiple churches in one shared install
(each team runs its own separate copy instead).

## 12. Glossary

| Term         | Meaning                                                                 |
|--------------|-------------------------------------------------------------------------|
| Service      | A scheduled gathering, usually a Sunday service                         |
| Setlist      | The ordered list of songs for one service                               |
| Roster       | Who is serving in which position for a service                          |
| Assignment   | One person in one position for one service                              |
| Blockout     | Dates a member is unavailable to serve                                  |
| Key          | The musical key a song is played in (for example G or D)                |
| BPM          | Beats per minute, the song's tempo                                      |
| ChordPro     | Plain-text format for chord charts: chords in brackets before the syllable, like `[G]Amazing` |
| CCLI         | Licensing service churches use to legally display and copy worship song lyrics |
| Selah        | A word in the Psalms, likely marking a musical pause                    |
