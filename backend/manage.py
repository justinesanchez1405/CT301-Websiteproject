#!/usr/bin/env python
"""Django's command-line tool for this project.

Every Django command (migrate, runserver, createsuperuser...) starts here.
It points Django at our settings file, then hands the command over to Django.
"""
import os
import sys


def main():
    # Tell Django which settings module to use before anything else loads.
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Is it installed and is your virtual "
            "environment activated? Try: pip install -r requirements.txt"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
