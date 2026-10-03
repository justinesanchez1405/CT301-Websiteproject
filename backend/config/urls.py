"""Top-level URL routes for the Tehillim back end.

Right now only the Django admin is wired up. The admin is the leader's backup
tool for managing songs, services, the roster, and join requests.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
    # TODO: Next step in Phase 3: add the REST API under /api/ (Django REST
    # Framework views and serializers), e.g. path("api/", include("...urls")).
]

# During development Django itself serves uploaded files (profile photos).
# In production a real web server or storage service does this instead.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
