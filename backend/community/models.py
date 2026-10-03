"""Models for team communication (announcements) and the public Join form."""
from django.conf import settings
from django.db import models

from accounts.models import Position


class Announcement(models.Model):
    """A message from a leader to the whole team, e.g. "Rehearsal moved to 5 PM"."""

    title = models.CharField(max_length=200)
    body = models.TextField()
    # SET_NULL (not CASCADE): if the author's account is removed later, the
    # announcement stays visible to the team; it just shows no author.
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="announcements",
    )
    # Pinned announcements stay at the top of the list.
    pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Pinned first (True sorts after False, hence the minus), then newest first.
        ordering = ["-pinned", "-created_at"]

    def __str__(self):
        return self.title


class JoinRequest(models.Model):
    """A visitor's application from the public Join form.

    The visitor has no account yet, so name/email/phone are stored here
    directly instead of linking to a User.
    """

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        APPROVED = "approved", "Approved"
        DECLINED = "declined", "Declined"

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    # Many-to-many to Position (instead of free text) so the leader can filter,
    # e.g. "everyone interested in Drums", and spellings stay consistent.
    positions_interested = models.ManyToManyField(Position, blank=True, related_name="join_requests")
    experience = models.TextField(blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"
