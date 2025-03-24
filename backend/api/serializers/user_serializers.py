from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "password", "is_staff", "is_superuser"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_username(self, value):
        if not value.startswith("@"): 
            raise serializers.ValidationError("Please ensure your username starts with '@'.")
        return value

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                is_staff=validated_data['is_staff'],
                is_superuser=validated_data['is_superuser'],
            )
            user.save()
        except Exception as e:
            print(e)
            user = None
        return user
