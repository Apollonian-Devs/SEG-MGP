from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Ticket


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "password", "is_staff", "is_superuser"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
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


class TicketSerializer(serializers.ModelSerializer):
    message = serializers.CharField(required=True)
    
    class Meta:
        model = Ticket
        fields = ["id", "subject", "description", "created_by", "assigned_to", "status", 
                "priority", "created_at", "updated_at", "closed_at", "due_date", "is_overdue", "message"]
        extra_kwargs = {
            "created_by": {"read_only": True},
            "subject": {"required": True},
            "description": {"required": True},
        }