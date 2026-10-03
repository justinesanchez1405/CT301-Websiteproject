"""Admin screens for positions and member profiles.

The Django admin is the leader's backup tool: it gives a working editor for
every table with no front-end code.
"""
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Position, Profile

User = get_user_model()


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "phone", "is_leader"]
    list_filter = ["is_leader", "positions"]
    search_fields = ["user__username", "user__first_name", "user__last_name", "user__email"]
    # Two side-by-side boxes are easier than a multi-select for many positions.
    filter_horizontal = ["positions"]


class ProfileInline(admin.StackedInline):
    """Shows the profile inside the user's page, so both are edited in one place."""

    model = Profile
    can_delete = False
    filter_horizontal = ["positions"]


# Replace the default User admin with one that includes the profile inline.
admin.site.unregister(User)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = [ProfileInline]
