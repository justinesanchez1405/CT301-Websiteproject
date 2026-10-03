"""App configuration for the accounts app: Team members, profiles, and positions."""
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    # BigAutoField = 64-bit ids, matching DEFAULT_AUTO_FIELD in settings.
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"
