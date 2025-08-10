from django.contrib import admin
from django.urls import path, include
from classifier.views import classify
from classifier.gemini_views import disposal_chat

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.posts.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/classify/', classify),
    path("api/disposal-chat/", disposal_chat),
]