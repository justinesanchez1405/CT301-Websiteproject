-- =============================================================================
-- Tehillim: MySQL 8 schema and demo data
-- =============================================================================
-- This script builds the same tables as the Django migrations, written out in
-- plain SQL so the design can be inspected or run without Python.
--
-- Run it with:   mysql -u root -p < schema.sql
--
-- It uses its own database, tehillim_demo, so it never clashes with the
-- "tehillim" database that Django's `manage.py migrate` manages.
-- Table and column names match what Django generates (app_model), except the
-- user table: see the note on `users` below.
--
-- Demo data rules: fictional @example.com users only, public-domain hymns only,
-- and at most the first line of each hymn.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS tehillim_demo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE tehillim_demo;

-- Drop in reverse dependency order so the script can be re-run cleanly.
DROP TABLE IF EXISTS community_joinrequest_positions_interested;
DROP TABLE IF EXISTS community_joinrequest;
DROP TABLE IF EXISTS community_announcement;
DROP TABLE IF EXISTS scheduling_assignment;
DROP TABLE IF EXISTS scheduling_setlistitem;
DROP TABLE IF EXISTS scheduling_blockout;
DROP TABLE IF EXISTS scheduling_service;
DROP TABLE IF EXISTS music_song_tags;
DROP TABLE IF EXISTS music_song;
DROP TABLE IF EXISTS music_tag;
DROP TABLE IF EXISTS accounts_profile_positions;
DROP TABLE IF EXISTS accounts_profile;
DROP TABLE IF EXISTS accounts_position;
DROP TABLE IF EXISTS users;

-- -----------------------------------------------------------------------------
-- users
-- In the Django project this table is NOT ours: Django's auth app creates it as
-- `auth_user` (plus groups and permissions tables). This simplified copy has the
-- same main columns so the foreign keys below have something to point at.
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id            INT          NOT NULL AUTO_INCREMENT,
  password      VARCHAR(128) NOT NULL,          -- a salted hash, never the real password
  last_login    DATETIME     NULL,
  is_superuser  BOOLEAN      NOT NULL DEFAULT FALSE,
  username      VARCHAR(150) NOT NULL,
  first_name    VARCHAR(150) NOT NULL DEFAULT '',
  last_name     VARCHAR(150) NOT NULL DEFAULT '',
  email         VARCHAR(254) NOT NULL DEFAULT '',
  is_staff      BOOLEAN      NOT NULL DEFAULT FALSE,  -- may log in to /admin
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  date_joined   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_uq (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- accounts app
-- -----------------------------------------------------------------------------
CREATE TABLE accounts_position (
  id    BIGINT      NOT NULL AUTO_INCREMENT,
  name  VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY accounts_position_name_uq (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE accounts_profile (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  phone      VARCHAR(30)  NOT NULL DEFAULT '',
  photo      VARCHAR(100) NOT NULL DEFAULT '',   -- file path inside media/
  is_leader  BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  UNIQUE KEY accounts_profile_user_uq (user_id),  -- UNIQUE makes it one-to-one
  CONSTRAINT accounts_profile_user_fk
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Join table for Profile <-> Position (many-to-many).
CREATE TABLE accounts_profile_positions (
  id           BIGINT NOT NULL AUTO_INCREMENT,
  profile_id   BIGINT NOT NULL,
  position_id  BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY accounts_profile_positions_uq (profile_id, position_id),
  CONSTRAINT accounts_profile_positions_profile_fk
    FOREIGN KEY (profile_id) REFERENCES accounts_profile (id) ON DELETE CASCADE,
  CONSTRAINT accounts_profile_positions_position_fk
    FOREIGN KEY (position_id) REFERENCES accounts_position (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- music app
-- -----------------------------------------------------------------------------
CREATE TABLE music_tag (
  id    BIGINT      NOT NULL AUTO_INCREMENT,
  name  VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY music_tag_name_uq (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE music_song (
  id              BIGINT            NOT NULL AUTO_INCREMENT,
  title           VARCHAR(200)      NOT NULL,
  author          VARCHAR(200)      NOT NULL DEFAULT '',
  default_key     VARCHAR(10)       NOT NULL,
  tempo_bpm       SMALLINT UNSIGNED NULL,          -- NULL = tempo not known yet
  time_signature  VARCHAR(10)       NOT NULL DEFAULT '4/4',
  chordpro        TEXT              NOT NULL,
  youtube_url     VARCHAR(200)      NOT NULL DEFAULT '',
  ccli_number     VARCHAR(20)       NOT NULL DEFAULT '',
  created_at      DATETIME(6)       NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY music_song_title_idx (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Join table for Song <-> Tag (many-to-many).
CREATE TABLE music_song_tags (
  id       BIGINT NOT NULL AUTO_INCREMENT,
  song_id  BIGINT NOT NULL,
  tag_id   BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY music_song_tags_uq (song_id, tag_id),
  CONSTRAINT music_song_tags_song_fk
    FOREIGN KEY (song_id) REFERENCES music_song (id) ON DELETE CASCADE,
  CONSTRAINT music_song_tags_tag_fk
    FOREIGN KEY (tag_id) REFERENCES music_tag (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- scheduling app
-- -----------------------------------------------------------------------------
CREATE TABLE scheduling_service (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  date          DATE         NOT NULL,
  start_time    TIME         NOT NULL,
  title         VARCHAR(200) NOT NULL,
  service_type  VARCHAR(20)  NOT NULL DEFAULT 'sunday',
  notes         TEXT         NOT NULL,
  is_public     BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  KEY scheduling_service_date_idx (date),
  -- Django enforces choices in forms; this CHECK enforces them in the database too.
  CONSTRAINT scheduling_service_type_chk
    CHECK (service_type IN ('sunday', 'rehearsal', 'special'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE scheduling_setlistitem (
  id          BIGINT            NOT NULL AUTO_INCREMENT,
  service_id  BIGINT            NOT NULL,
  song_id     BIGINT            NOT NULL,
  `order`     SMALLINT UNSIGNED NOT NULL,   -- backticks: ORDER is an SQL keyword
  `key`       VARCHAR(10)       NOT NULL DEFAULT '',  -- KEY is an SQL keyword too
  notes       VARCHAR(255)      NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  UNIQUE KEY unique_setlist_order_per_service (service_id, `order`),
  CONSTRAINT scheduling_setlistitem_service_fk
    FOREIGN KEY (service_id) REFERENCES scheduling_service (id) ON DELETE CASCADE,
  -- RESTRICT = Django's PROTECT: a song used in a setlist can't be deleted.
  CONSTRAINT scheduling_setlistitem_song_fk
    FOREIGN KEY (song_id) REFERENCES music_song (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE scheduling_assignment (
  id           BIGINT      NOT NULL AUTO_INCREMENT,
  service_id   BIGINT      NOT NULL,
  user_id      INT         NOT NULL,
  position_id  BIGINT      NOT NULL,
  status       VARCHAR(10) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (id),
  UNIQUE KEY unique_assignment (service_id, user_id, position_id),
  CONSTRAINT scheduling_assignment_service_fk
    FOREIGN KEY (service_id) REFERENCES scheduling_service (id) ON DELETE CASCADE,
  CONSTRAINT scheduling_assignment_user_fk
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT scheduling_assignment_position_fk
    FOREIGN KEY (position_id) REFERENCES accounts_position (id) ON DELETE RESTRICT,
  CONSTRAINT scheduling_assignment_status_chk
    CHECK (status IN ('pending', 'confirmed', 'declined'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE scheduling_blockout (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  user_id     INT          NOT NULL,
  start_date  DATE         NOT NULL,
  end_date    DATE         NOT NULL,
  note        VARCHAR(200) NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  KEY scheduling_blockout_dates_idx (user_id, start_date, end_date),
  CONSTRAINT scheduling_blockout_user_fk
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  -- Same rule as the Django CheckConstraint: a blockout can't end before it starts.
  CONSTRAINT blockout_end_on_or_after_start
    CHECK (end_date >= start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- community app
-- -----------------------------------------------------------------------------
CREATE TABLE community_announcement (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  title       VARCHAR(200) NOT NULL,
  body        TEXT         NOT NULL,
  author_id   INT          NULL,      -- NULL allowed so SET NULL can work
  pinned      BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  CONSTRAINT community_announcement_author_fk
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE community_joinrequest (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(254) NOT NULL,
  phone       VARCHAR(30)  NOT NULL DEFAULT '',
  experience  TEXT         NOT NULL,
  message     TEXT         NOT NULL,
  status      VARCHAR(10)  NOT NULL DEFAULT 'new',
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY community_joinrequest_status_idx (status),
  CONSTRAINT community_joinrequest_status_chk
    CHECK (status IN ('new', 'contacted', 'approved', 'declined'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Join table for JoinRequest <-> Position (many-to-many).
CREATE TABLE community_joinrequest_positions_interested (
  id              BIGINT NOT NULL AUTO_INCREMENT,
  joinrequest_id  BIGINT NOT NULL,
  position_id     BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY community_joinrequest_positions_uq (joinrequest_id, position_id),
  CONSTRAINT community_joinrequest_positions_request_fk
    FOREIGN KEY (joinrequest_id) REFERENCES community_joinrequest (id) ON DELETE CASCADE,
  CONSTRAINT community_joinrequest_positions_position_fk
    FOREIGN KEY (position_id) REFERENCES accounts_position (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- Demo data
-- Explicit ids keep the foreign keys below easy to read.
-- =============================================================================

-- Positions from docs/SPEC.md section 3.
INSERT INTO accounts_position (id, name) VALUES
  (1, 'Worship leader'),
  (2, 'Vocals'),
  (3, 'Keys'),
  (4, 'Acoustic guitar'),
  (5, 'Electric guitar'),
  (6, 'Bass'),
  (7, 'Drums'),
  (8, 'Sound'),
  (9, 'Lyrics/Projection');

-- Fictional demo users. The password value is a placeholder, not a real hash:
-- Django treats a password starting with "!" as "unusable", so nobody can log
-- in as these users. Create real logins with `manage.py createsuperuser`.
INSERT INTO users (id, password, is_superuser, username, first_name, last_name, email, is_staff, is_active) VALUES
  (1, '!demo-placeholder-not-a-real-hash', FALSE, 'demo_leader',    'Demo', 'Leader',    'leader@example.com',    TRUE,  TRUE),
  (2, '!demo-placeholder-not-a-real-hash', FALSE, 'demo_singer',    'Demo', 'Singer',    'singer@example.com',    FALSE, TRUE),
  (3, '!demo-placeholder-not-a-real-hash', FALSE, 'demo_guitarist', 'Demo', 'Guitarist', 'guitarist@example.com', FALSE, TRUE);

INSERT INTO accounts_profile (id, user_id, phone, photo, is_leader) VALUES
  (1, 1, '', '', TRUE),
  (2, 2, '', '', FALSE),
  (3, 3, '', '', FALSE);

-- The leader also plays keys; this shows a member holding two positions.
INSERT INTO accounts_profile_positions (profile_id, position_id) VALUES
  (1, 1), (1, 3),
  (2, 2),
  (3, 4), (3, 5);

INSERT INTO music_tag (id, name) VALUES
  (1, 'hymn'),
  (2, 'opening'),
  (3, 'reflective'),
  (4, 'communion'),
  (5, 'celebration');

-- Six public-domain hymns. ChordPro holds only the first line.
INSERT INTO music_song (id, title, author, default_key, tempo_bpm, time_signature, chordpro, youtube_url, ccli_number) VALUES
  (1, 'Amazing Grace', 'John Newton', 'G', 72, '3/4',
      '{title: Amazing Grace}\n[G]Amazing grace! How [C]sweet the [G]sound', '', ''),
  (2, 'Holy, Holy, Holy', 'Reginald Heber', 'D', 84, '4/4',
      '{title: Holy, Holy, Holy}\n[D]Holy, holy, [Bm]holy! [G]Lord God Al[D]mighty!', '', ''),
  (3, 'Be Thou My Vision', 'Traditional Irish', 'D', 90, '3/4',
      '{title: Be Thou My Vision}\n[D]Be Thou my [G]vision, O [D]Lord of my heart', '', ''),
  (4, 'It Is Well with My Soul', 'Horatio Spafford', 'C', 70, '4/4',
      '{title: It Is Well with My Soul}\n[C]When peace like a [F]river at[C]tendeth my way', '', ''),
  (5, 'Come Thou Fount of Every Blessing', 'Robert Robinson', 'D', 96, '3/4',
      '{title: Come Thou Fount of Every Blessing}\n[D]Come, Thou Fount of [G]every [D]blessing', '', ''),
  (6, 'Crown Him with Many Crowns', 'Matthew Bridges', 'D', 100, '4/4',
      '{title: Crown Him with Many Crowns}\n[D]Crown Him with [G]many [D]crowns', '', '');

INSERT INTO music_song_tags (song_id, tag_id) VALUES
  (1, 1), (1, 3),
  (2, 1), (2, 2),
  (3, 1), (3, 3),
  (4, 1), (4, 3), (4, 4),
  (5, 1), (5, 5),
  (6, 1), (6, 2), (6, 5);

-- One rehearsal (private) and the Sunday service it prepares for (public).
INSERT INTO scheduling_service (id, date, start_time, title, service_type, notes, is_public) VALUES
  (1, '2026-10-10', '16:00:00', 'Saturday Rehearsal', 'rehearsal', 'Run through Sunday''s set.', FALSE),
  (2, '2026-10-11', '09:00:00', 'Sunday Morning Worship', 'sunday', 'Communion Sunday.', TRUE);

INSERT INTO scheduling_setlistitem (service_id, song_id, `order`, `key`, notes) VALUES
  (1, 6, 1, '',  'Full band'),
  (1, 3, 2, '',  ''),
  (1, 4, 3, 'D', 'Trying it a step higher'),
  (2, 6, 1, '',  'Opening, full band'),
  (2, 3, 2, '',  ''),
  (2, 4, 3, 'D', 'During communion'),
  (2, 1, 4, '',  'Closing, a cappella last verse');

INSERT INTO scheduling_assignment (service_id, user_id, position_id, status) VALUES
  (1, 1, 1, 'confirmed'),
  (1, 2, 2, 'confirmed'),
  (1, 3, 4, 'confirmed'),
  (2, 1, 1, 'confirmed'),
  (2, 1, 3, 'confirmed'),   -- same person, second position: conflicts() warns about this
  (2, 2, 2, 'pending'),
  (2, 3, 4, 'declined');

-- The singer is away the following weekend; assigning them then would warn.
INSERT INTO scheduling_blockout (user_id, start_date, end_date, note) VALUES
  (2, '2026-10-17', '2026-10-18', 'Out of town');

INSERT INTO community_announcement (title, body, author_id, pinned) VALUES
  ('Welcome to Tehillim',
   'This is where we plan each Sunday. Check your schedule and confirm your assignments.',
   1, TRUE);

INSERT INTO community_joinrequest (id, name, email, phone, experience, message, status) VALUES
  (1, 'Demo Applicant', 'applicant@example.com', '',
   'Played keys in a school band for three years.',
   'I would love to help on Sundays.', 'new');

INSERT INTO community_joinrequest_positions_interested (joinrequest_id, position_id) VALUES
  (1, 2), (1, 3);

-- Example query: the full setlist for the Sunday service, with the key to play.
-- SELECT si.`order`, s.title, COALESCE(NULLIF(si.`key`, ''), s.default_key) AS play_in
-- FROM scheduling_setlistitem si JOIN music_song s ON s.id = si.song_id
-- WHERE si.service_id = 2 ORDER BY si.`order`;
