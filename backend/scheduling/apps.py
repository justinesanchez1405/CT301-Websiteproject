"""App configuration for the scheduling app: Services, setlists, roster, and availability."""
from django.apps import AppConfig


class SchedulingConfig(AppConfig):
    # BigAutoField = 64-bit ids, matching DEFAULT_AUTO_FIELD in settings.
    default_auto_field = "django.db.models.BigAutoField"
    name = "scheduling"
