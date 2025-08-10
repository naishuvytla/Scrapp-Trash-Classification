from django.contrib import admin
from django.urls import path, include
from classifier.views import classify

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.posts.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/classify/', classify),
]