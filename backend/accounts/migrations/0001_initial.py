# Initial migration for the accounts app (written by hand to match models.py).
#
# A migration is a recipe Django follows to create or change tables, so every
# copy of the project (your laptop, the teacher's, the server) gets the same
# database structure by running "python manage.py migrate".

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    # Profile points at the user table, so Django's auth tables must exist first.
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Position",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=50, unique=True)),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("phone", models.CharField(blank=True, max_length=30)),
                ("photo", models.ImageField(blank=True, upload_to="profile_photos/")),
                ("is_leader", models.BooleanField(default=False)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "positions",
                    models.ManyToManyField(blank=True, related_name="profiles", to="accounts.position"),
                ),
            ],
            options={
                "ordering": ["user__username"],
            },
        ),
    ]
