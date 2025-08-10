from rest_framework import viewsets, permissions
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    """
    Handles list, create, retrieve, update, delete for Post.
    Allows filtering by ?category=<slug>.
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Post.objects.select_related('author').order_by('-created_at')
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)