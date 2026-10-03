"""App configuration for the community app: Announcements and join requests."""
from django.apps import AppConfig


class CommunityConfig(AppConfig):
    # BigAutoField = 64-bit ids, matching DEFAULT_AUTO_FIELD in settings.
    default_auto_field = "django.db.models.BigAutoField"
    name = "community"
