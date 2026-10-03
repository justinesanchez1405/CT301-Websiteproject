"""Django settings for the Tehillim back end.

Why environment variables? Settings like the secret key and database password
differ between your laptop and a real server, and must never be committed to
Git. So we read them from the environment (or a local .env file) and fall back
to safe development defaults when they are missing.
"""
import os
from pathlib import Path

# BASE_DIR is the backend/ folder. Paths below are built from it so the project
# works no matter where it is cloned.
BASE_DIR = Path(__file__).resolve().parent.parent


def load_env_file(path):
    """Load KEY=value lines from a .env file into os.environ.

    A tiny built-in reader so we don't need an extra library (python-dotenv)
    for something this simple. Values already set in the real environment win,
    which is how hosting providers usually pass secrets.
    """
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def env_bool(name, default=False):
    """Environment variables are always text, so turn "True"/"1"/"yes" into a real bool."""
    return os.environ.get(name, str(default)).strip().lower() in ("1", "true", "yes", "on")


load_env_file(BASE_DIR / ".env")

# --- Core security settings -------------------------------------------------

# The dev default is deliberately obvious so nobody mistakes it for a real key.
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-insecure-key-change-me")
DEBUG = env_bool("DEBUG", default=True)
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]

# --- Installed apps ---------------------------------------------------------

INSTALLED_APPS = [
    # Django's built-in pieces: admin site, users and login, sessions, etc.
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party: Django REST Framework, used for the /api/ endpoints next.
    "rest_framework",
    # Our four apps, one per area of the product (see docs/SPEC.md section 7).
    "accounts",
    "music",
    "scheduling",
    "community",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# --- Database ---------------------------------------------------------------
# SQLite is a single file and needs no server, which is ideal while learning.
# Set DB_ENGINE=mysql in .env to switch to MySQL (the Phase 3 target).

if os.environ.get("DB_ENGINE", "sqlite").lower() == "mysql":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": os.environ.get("DB_NAME", "tehillim"),
            "USER": os.environ.get("DB_USER", "root"),
            "PASSWORD": os.environ.get("DB_PASSWORD", ""),
            "HOST": os.environ.get("DB_HOST", "127.0.0.1"),
            "PORT": os.environ.get("DB_PORT", "3306"),
            "OPTIONS": {
                # utf8mb4 stores every Unicode character, including Hebrew
                # (תְּהִלִּים) and emoji. MySQL's older "utf8" cannot.
                "charset": "utf8mb4",
                # Strict mode makes MySQL reject bad data instead of silently
                # truncating it.
                "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Every table gets a 64-bit auto-incrementing id unless an app says otherwise.
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Passwords --------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- Language and time ------------------------------------------------------

LANGUAGE_CODE = "en-us"
TIME_ZONE = os.environ.get("TIME_ZONE", "UTC")
USE_I18N = True
# Store datetimes in UTC and convert for display: avoids daylight-saving bugs.
USE_TZ = True

# --- Static and uploaded files ----------------------------------------------

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Uploaded files (profile photos) go here. media/ is in .gitignore.
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# --- Django REST Framework --------------------------------------------------
# Session authentication: the browser keeps a login cookie, the same way the
# admin works. Simpler than tokens while the React app shares Django's origin.
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}
