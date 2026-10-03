"""WSGI entry point: how a traditional production web server (e.g. Gunicorn) runs the app."""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()
