"""Models for the song library.

Lyrics note: demo data uses public-domain hymns only. Each team adds its own
songs under its church's CCLI license.
"""
from django.db import models


class Tag(models.Model):
    """A label for filtering songs, e.g. "hymn", "communion", "opening".

    Why a separate table instead of a comma-separated text field on Song?
    With a table, "show every communion song" is a fast, exact database query,
    and a typo can't quietly create "comunion" as a second tag.
    """

    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Song(models.Model):
    """One song in the team's library, with what the band needs to play it."""

    title = models.CharField(max_length=200)
    # Writer or composer. Optional, because some traditional songs have none.
    author = models.CharField(max_length=200, blank=True)
    # Text like "G", "Bb" or "F#m". Each setlist can still override the key.
    default_key = models.CharField(max_length=10)
    # null=True: "we don't know the tempo yet" is different from 0 bpm.
    tempo_bpm = models.PositiveSmallIntegerField(null=True, blank=True)
    time_signature = models.CharField(max_length=10, default="4/4")
    # ChordPro is a plain-text format with chords in brackets: "[G]Amazing [C]grace".
    # It lets the Phase 4 transposer change keys automatically.
    chordpro = models.TextField(blank=True)
    youtube_url = models.URLField(blank=True)
    # Text, not a number: it is an identifier, never used in arithmetic.
    ccli_number = models.CharField(max_length=20, blank=True)
    # Many-to-many: a song has many tags and a tag is on many songs.
    tags = models.ManyToManyField(Tag, blank=True, related_name="songs")
    # auto_now_add fills this in once, when the song is first saved.
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title
