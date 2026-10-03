"""Admin screens for announcements and join requests."""
from django.contrib import admin

from .models import Announcement, JoinRequest


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "pinned", "created_at"]
    list_filter = ["pinned", "created_at"]
    search_fields = ["title", "body"]


@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "phone", "status", "created_at"]
    list_filter = ["status", "positions_interested", "created_at"]
    search_fields = ["name", "email", "message"]
    filter_horizontal = ["positions_interested"]
    # Leaders can change status right from the list, without opening each request.
    list_editable = ["status"]
