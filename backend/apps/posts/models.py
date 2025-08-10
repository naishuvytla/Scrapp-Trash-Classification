# apps/posts/models.py
from django.db import models
from django.conf import settings

class Post(models.Model):
    CATEGORY_CHOICES = [
        ('waste_recycling', 'Waste & Recycling'),
        ('upcycling_diy', 'Upcycling & DIY'),
        ('sustainable_living', 'Sustainable Living Tips'),
        ('food_composting', 'Food & Composting'),
        ('green_tech', 'Green Tech & Innovation'),
        ('community_events', 'Community & Events'),
    ]

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES, db_index=True, default='waste_recycling')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title