from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Ticket, Department, Officer, TicketMessage


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

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name"]

class OfficerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    department = DepartmentSerializer()

    class Meta:
        model = Officer
        fields = ["id", "user", "department"]

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["id", "title", "description", "created_at", "student"]
        extra_kwargs = {"student": {"read_only": True}}



class TicketMessageSerialiser(serializers.ModelSerializer):
    class Meta:
        model = TicketMessage
        '''
        ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
        sender_profile = models.ForeignKey(User, on_delete=models.CASCADE)
        message_body = models.TextField()
        created_at = models.DateTimeField(auto_now_add=True)
        is_internal = models.BooleanField(default=False)
        '''
        fields = ["ticket", "sender_profile","message_body","created_at"]

