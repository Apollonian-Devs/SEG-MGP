from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Officer, Department
from .user_serializers import UserSerializer

class OfficerSerializer(serializers.ModelSerializer):
    """  
    Serializes officer data with nested user information.

Fields:
    - id: Officer ID
    - user: Nested user data
    - department: Department ID
    - is_department_head: Leadership flag

Methods:
    - create: Handles nested user creation
    """  
    user = UserSerializer()
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    is_department_head = serializers.BooleanField(default=False, required=False)

    class Meta:
        model = Officer
        fields = ["id", "user", "department", "is_department_head"]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user, created = User.objects.get_or_create(**user_data) 
        officer = Officer.objects.create(user=user, **validated_data)
        return officer