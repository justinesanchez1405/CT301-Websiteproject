# Tehillim back end (Phase 3)

Django project that stores the team's data: members, positions, songs, services,
setlists, the roster, blockouts, announcements, and join requests. The design is
explained in [`../docs/database-design.md`](../docs/database-design.md).

```
backend/
├── manage.py          Django's command-line tool
├── config/            project settings and top-level URLs
├── accounts/          Profile, Position
├── music/             Song, Tag
├── scheduling/        Service, SetlistItem, Assignment, Blockout
├── community/         Announcement, JoinRequest
├── schema.sql         the same tables in plain MySQL, plus demo data
├── requirements.txt   Python packages
└── .env.example       settings template (copy to .env)
```

## 1. Set up (SQLite, quickest)

Requires Python 3.10 or newer. Run these from the `backend/` folder.

```bash
python -m venv venv
# Windows:            venv\Scripts\activate
# macOS / Linux:      source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env          # Windows: copy .env.example .env
# Edit .env and set SECRET_KEY to a long random string.

python manage.py migrate          # creates db.sqlite3 and all tables
python manage.py createsuperuser  # your admin login
python manage.py runserver
```

Open http://127.0.0.1:8000/admin/ and log in. From the admin you can add positions,
songs and tags, create services with their setlist and roster on one page, and
review join requests. The Assignments list shows roster conflict warnings.

## 2. Use MySQL instead of SQLite

1. Install MySQL 8 and create a database and user:

   ```sql
   CREATE DATABASE tehillim CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   CREATE USER 'tehillim_user'@'localhost' IDENTIFIED BY 'choose-a-password';
   GRANT ALL PRIVILEGES ON tehillim.* TO 'tehillim_user'@'localhost';
   ```

2. In `.env`, set `DB_ENGINE=mysql` and fill in `DB_NAME`, `DB_USER`, `DB_PASSWORD`,
   `DB_HOST`, `DB_PORT`.
3. Run `python manage.py migrate` again, then `createsuperuser`.

## 3. Load `schema.sql` directly (no Django needed)

`schema.sql` creates the same tables in plain SQL with demo data (fictional users,
public-domain hymns). It uses a separate database, `tehillim_demo`, so it never
clashes with the database Django manages.

```bash
mysql -u root -p < schema.sql
mysql -u root -p tehillim_demo -e "SELECT title, author, default_key FROM music_song;"
```

## What comes next

The REST API (`/api/...` endpoints with Django REST Framework), login for the
React app, and connecting `frontend/` to these endpoints come later in Phase 3.
For now `config/urls.py` only serves the admin.
