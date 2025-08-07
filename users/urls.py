from django.urls import path
from .views import LoginView
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', LoginView.as_view(), name='login'),
]