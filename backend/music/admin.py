"""Admin screens for the song library."""
from django.contrib import admin

from .models import Song, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "default_key", "tempo_bpm", "time_signature", "created_at"]
    list_filter = ["tags", "default_key", "time_signature"]
    search_fields = ["title", "author", "ccli_number"]
    filter_horizontal = ["tags"]
