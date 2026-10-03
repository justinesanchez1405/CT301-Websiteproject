# Initial migration for the scheduling app (written by hand to match models.py).

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    # Scheduling points at songs (music), positions (accounts) and users, so
    # those tables must be created before this migration runs.
    dependencies = [
        ("accounts", "0001_initial"),
        ("music", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Service",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("date", models.DateField()),
                ("start_time", models.TimeField()),
                ("title", models.CharField(max_length=200)),
                (
                    "service_type",
                    models.CharField(
                        choices=[
                            ("sunday", "Sunday service"),
                            ("rehearsal", "Rehearsal"),
                            ("special", "Special event"),
                        ],
                        default="sunday",
                        max_length=20,
                    ),
                ),
                ("notes", models.TextField(blank=True)),
                ("is_public", models.BooleanField(default=False)),
            ],
            options={
                "ordering": ["date", "start_time"],
            },
        ),
        migrations.CreateModel(
            name="Blockout",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("start_date", models.DateField()),
                ("end_date", models.DateField()),
                ("note", models.CharField(blank=True, max_length=200)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="blockouts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["start_date"],
                "constraints": [
                    models.CheckConstraint(
                        condition=models.Q(("end_date__gte", models.F("start_date"))),
                        name="blockout_end_on_or_after_start",
                    ),
                ],
            },
        ),
        migrations.CreateModel(
            name="SetlistItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order", models.PositiveSmallIntegerField()),
                ("key", models.CharField(blank=True, max_length=10)),
                ("notes", models.CharField(blank=True, max_length=255)),
                (
                    "service",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="setlist_items",
                        to="scheduling.service",
                    ),
                ),
                (
                    "song",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="setlist_items",
                        to="music.song",
                    ),
                ),
            ],
            options={
                "ordering": ["service", "order"],
                "constraints": [
                    models.UniqueConstraint(
                        fields=("service", "order"),
                        name="unique_setlist_order_per_service",
                    ),
                ],
            },
        ),
        migrations.CreateModel(
            name="Assignment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("confirmed", "Confirmed"),
                            ("declined", "Declined"),
                        ],
                        default="pending",
                        max_length=10,
                    ),
                ),
                (
                    "position",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="assignments",
                        to="accounts.position",
                    ),
                ),
                (
                    "service",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="assignments",
                        to="scheduling.service",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="assignments",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["service", "position"],
                "constraints": [
                    models.UniqueConstraint(
                        fields=("service", "user", "position"),
                        name="unique_assignment",
                    ),
                ],
            },
        ),
    ]
