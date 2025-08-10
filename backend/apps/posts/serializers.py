from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    category_label = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'category', 'category_label', 'author', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']

    def get_category_label(self, obj):
        return obj.get_category_display()

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['author'] = request.user
        return super().create(validated_data)