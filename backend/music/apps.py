"""App configuration for the music app: The song library."""
from django.apps import AppConfig


class MusicConfig(AppConfig):
    # BigAutoField = 64-bit ids, matching DEFAULT_AUTO_FIELD in settings.
    default_auto_field = "django.db.models.BigAutoField"
    name = "music"
