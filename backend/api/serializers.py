from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Ticket, Department, Officer, TicketMessage, Notification, TicketRedirect



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
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())  

    class Meta:
        model = Officer
        fields = ["id", "user", "department"]

class TicketSerializer(serializers.ModelSerializer):
    attachments = serializers.ListField(child=serializers.DictField(), required=False)
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)  
    class Meta:
        model = Ticket
        fields = ["id", "subject", "description", "created_by", "assigned_to", "status", 
                "priority", "created_at", "updated_at", "closed_at", "due_date", "is_overdue", "attachments"]
        extra_kwargs = {
            "created_by": {"read_only": True},
            "subject": {"required": True},
            "description": {"required": True},
        }


        
class TicketRedirectSerializer(serializers.ModelSerializer):
    ticket = serializers.PrimaryKeyRelatedField(queryset=Ticket.objects.all())
    from_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    to_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())


    class Meta:
        model = TicketRedirect
        fields = ["ticket", "from_profile", "to_profile"]



class TicketMessageSerializer(serializers.ModelSerializer):
    sender_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    ticket = serializers.PrimaryKeyRelatedField(queryset=Ticket.objects.all())
    class Meta:
        model = TicketMessage
        '''
        ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
        sender_profile = models.ForeignKey(User, on_delete=models.CASCADE)
        message_body = models.TextField()
        created_at = models.DateTimeField(auto_now_add=True)
        is_internal = models.BooleanField(default=False)
        '''
        fields = ["sender_profile", "ticket", "message_body"]


class NotificationSerializer(serializers.ModelSerializer):
    user_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    ticket_subject = serializers.CharField(source="ticket.subject",read_only=True)
    class Meta:
        model = Notification
        fields = ["id","user_profile", "ticket_subject" ,"message", "created_at", "read_status"]
        extra_kwargs = {"student": {"read_only": True}}

