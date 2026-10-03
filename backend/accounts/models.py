"""Models for team members: their profile and the positions they can serve in.

We don't build our own User model. Django's built-in User already handles
username, email, password hashing and login. Profile adds the extra details a
worship team needs and links to User one-to-one.
"""
from django.conf import settings
from django.db import models


class Position(models.Model):
    """A role someone can serve in, e.g. "Vocals", "Keys" or "Sound".

    Positions are a table (not a fixed list in code) so each church can add or
    rename roles in the admin without a programmer.
    """

    # unique=True: two "Bass" rows would make the roster confusing.
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Profile(models.Model):
    """Extra information about a team member, attached to Django's User."""

    # One-to-one: each user has at most one profile. CASCADE: if the user
    # account is deleted, their profile has no purpose and goes too.
    # settings.AUTH_USER_MODEL (not User directly) is the recommended way to
    # point at the user table, in case a custom user model is ever swapped in.
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    # A phone number is text, not a number: it can have "+", spaces, and
    # leading zeros that a number type would lose.
    phone = models.CharField(max_length=30, blank=True)
    # The database stores only the file path; the image itself goes in media/.
    photo = models.ImageField(upload_to="profile_photos/", blank=True)
    # Many-to-many: one member can play keys AND sing, and each position has
    # many members. Django creates a hidden join table for this.
    positions = models.ManyToManyField(Position, blank=True, related_name="profiles")
    # Leaders can plan services and manage the roster (enforced in the API later).
    is_leader = models.BooleanField(default=False)

    class Meta:
        ordering = ["user__username"]

    def __str__(self):
        return self.user.get_full_name() or self.user.get_username()
