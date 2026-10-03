# Initial migration for the music app (written by hand to match models.py).

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    # Songs and tags don't point at any other app, so nothing needs to exist first.
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Tag",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=50, unique=True)),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Song",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("author", models.CharField(blank=True, max_length=200)),
                ("default_key", models.CharField(max_length=10)),
                ("tempo_bpm", models.PositiveSmallIntegerField(blank=True, null=True)),
                ("time_signature", models.CharField(default="4/4", max_length=10)),
                ("chordpro", models.TextField(blank=True)),
                ("youtube_url", models.URLField(blank=True)),
                ("ccli_number", models.CharField(blank=True, max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("tags", models.ManyToManyField(blank=True, related_name="songs", to="music.tag")),
            ],
            options={
                "ordering": ["title"],
            },
        ),
    ]
