"""Models for planning services: the service itself, its setlist, who serves
(the roster), and when members are unavailable (blockouts).
"""
from django.conf import settings
from django.db import models
from django.db.models import F, Q

from accounts.models import Position
from music.models import Song


class Service(models.Model):
    """A Sunday service, rehearsal, or special event the team plays at."""

    # TextChoices keeps the allowed values in one place. The first item in each
    # pair is stored in the database; the second is the label people see.
    class ServiceType(models.TextChoices):
        SUNDAY = "sunday", "Sunday service"
        REHEARSAL = "rehearsal", "Rehearsal"
        SPECIAL = "special", "Special event"

    date = models.DateField()
    start_time = models.TimeField()
    title = models.CharField(max_length=200)
    service_type = models.CharField(
        max_length=20,
        choices=ServiceType.choices,
        default=ServiceType.SUNDAY,
    )
    notes = models.TextField(blank=True)
    # Only public services appear on the public Events page. Rehearsals
    # usually stay private, so the safe default is False.
    is_public = models.BooleanField(default=False)

    class Meta:
        ordering = ["date", "start_time"]

    def __str__(self):
        return f"{self.title} ({self.date})"


class SetlistItem(models.Model):
    """One song in one service's setlist, in a given position and key.

    This is a "join table with extra data": it links Service and Song (many
    to many) but also stores the order and the key for that particular day.
    """

    # CASCADE: deleting a service deletes its setlist, which only made sense for it.
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="setlist_items")
    # PROTECT: you can't delete a song that past or future setlists still use.
    # This stops a leader from accidentally wiping history.
    song = models.ForeignKey(Song, on_delete=models.PROTECT, related_name="setlist_items")
    # 1 = first song, 2 = second... Unique per service (see constraint below).
    order = models.PositiveSmallIntegerField()
    # Blank means "use the song's default key".
    key = models.CharField(max_length=10, blank=True)
    notes = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["service", "order"]
        constraints = [
            # Two songs can't both be "song #2" in the same service.
            models.UniqueConstraint(fields=["service", "order"], name="unique_setlist_order_per_service"),
        ]

    def __str__(self):
        return f"{self.order}. {self.song} ({self.service})"


class Blockout(models.Model):
    """Dates a member is unavailable (vacation, work, illness...).

    Leaders see these as warnings when building the roster.
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blockouts")
    start_date = models.DateField()
    # For a single day, start_date and end_date are the same.
    end_date = models.DateField()
    note = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["start_date"]
        constraints = [
            # The database itself refuses a blockout that ends before it starts,
            # even if a bug in the API or a manual SQL insert tries it.
            models.CheckConstraint(
                condition=Q(end_date__gte=F("start_date")),
                name="blockout_end_on_or_after_start",
            ),
        ]

    def __str__(self):
        return f"{self.user} unavailable {self.start_date} to {self.end_date}"


class Assignment(models.Model):
    """One person serving in one position at one service (a roster entry)."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        DECLINED = "declined", "Declined"

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="assignments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assignments")
    # PROTECT: a position that is in use on the roster can't be deleted by accident.
    position = models.ForeignKey(Position, on_delete=models.PROTECT, related_name="assignments")
    # New assignments wait for the member to confirm or decline.
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)

    class Meta:
        ordering = ["service", "position"]
        constraints = [
            # The same person can't be added twice to the same position at the
            # same service. (Two different positions is allowed, e.g. a
            # worship leader who also plays keys, but conflicts() warns about it.)
            models.UniqueConstraint(fields=["service", "user", "position"], name="unique_assignment"),
        ]

    def __str__(self):
        return f"{self.user} - {self.position} - {self.service}"

    def conflicts(self):
        """Return a list of human-readable warnings about this assignment.

        These are warnings, not errors: the leader may still go ahead (for
        example, someone who leads AND plays keys). An empty list means no
        conflicts. Checked:
          1. The member has a blockout covering the service date.
          2. The member is already assigned to this service in another position.
        """
        # Without a service and a user there is nothing to compare yet.
        if not self.service_id or not self.user_id:
            return []

        warnings = []
        name = self.user.get_full_name() or self.user.get_username()
        service_date = self.service.date

        # A blockout overlaps the date when it starts on or before it AND ends
        # on or after it.
        blockouts = Blockout.objects.filter(
            user_id=self.user_id,
            start_date__lte=service_date,
            end_date__gte=service_date,
        )
        for blockout in blockouts:
            message = f"{name} is unavailable from {blockout.start_date} to {blockout.end_date}"
            if blockout.note:
                message += f" ({blockout.note})"
            warnings.append(message + ".")

        # Other roster rows for the same person and service. exclude(pk=...)
        # skips this assignment itself when it has already been saved.
        other_assignments = (
            Assignment.objects.filter(service_id=self.service_id, user_id=self.user_id)
            .exclude(pk=self.pk)
            .select_related("position")
        )
        for other in other_assignments:
            warnings.append(f"{name} is already assigned to this service as {other.position}.")

        return warnings
