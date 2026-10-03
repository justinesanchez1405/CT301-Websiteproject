"""Admin screens for services, setlists, the roster, and blockouts."""
from django.contrib import admin

from .models import Assignment, Blockout, Service, SetlistItem


class SetlistItemInline(admin.TabularInline):
    """Edit a service's setlist right on the service page, one row per song."""

    model = SetlistItem
    extra = 1
    # A search box instead of a giant dropdown once the library grows.
    autocomplete_fields = ["song"]


class AssignmentInline(admin.TabularInline):
    """Build the roster for a service on the same page as its setlist."""

    model = Assignment
    extra = 1
    readonly_fields = ["conflict_warnings"]

    @admin.display(description="Warnings")
    def conflict_warnings(self, obj):
        # Saved rows show their warnings; empty new rows show nothing.
        return " ".join(obj.conflicts()) if obj and obj.pk else ""


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title", "date", "start_time", "service_type", "is_public"]
    list_filter = ["service_type", "is_public", "date"]
    search_fields = ["title", "notes"]
    date_hierarchy = "date"
    inlines = [SetlistItemInline, AssignmentInline]


@admin.register(SetlistItem)
class SetlistItemAdmin(admin.ModelAdmin):
    list_display = ["service", "order", "song", "key"]
    list_filter = ["service__service_type"]
    search_fields = ["song__title", "service__title"]


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ["service", "user", "position", "status", "conflict_warnings"]
    list_filter = ["status", "position", "service__date"]
    search_fields = ["user__username", "user__first_name", "user__last_name", "service__title"]

    @admin.display(description="Warnings")
    def conflict_warnings(self, obj):
        # The roster rule from the spec: warn, but don't block.
        return " ".join(obj.conflicts()) or "None"


@admin.register(Blockout)
class BlockoutAdmin(admin.ModelAdmin):
    list_display = ["user", "start_date", "end_date", "note"]
    list_filter = ["start_date"]
    search_fields = ["user__username", "user__first_name", "user__last_name", "note"]
