from django.contrib.auth.models import User
from rest_framework import serializers
from django.utils import timezone
from .models import Ticket, Department, Officer, TicketMessage, Notification, TicketRedirect, TicketStatusHistory, TicketAttachment

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
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Use ID instead of nested serializer
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    is_department_head = serializers.BooleanField(default=False, required=False)

    class Meta:
        model = Officer
        fields = ["id", "user", "department", "is_department_head"]

    def create(self, validated_data):
        user = validated_data.pop('user')  # This will now be an actual User instance
        officer = Officer.objects.create(user=user, **validated_data)
        return officer




class TicketAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAttachment
        fields = ["file_name", "file_path", "mime_type"]


class TicketSerializer(serializers.ModelSerializer):
    message = serializers.CharField(required=False, write_only=True)
    attachments = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket

        fields = ["id", "subject", "description", "created_by", "assigned_to", "status", 
                "priority", "created_at", "updated_at", "closed_at", "due_date", "is_overdue", 
                "message", "attachments"]
        extra_kwargs = {
            "created_by": {"read_only": True},
            "subject": {"required": True},
            "description": {"required": True},
        }
    def get_attachments(self, obj):
        """ Fetch all attachments related to this ticket through its messages. """
        ticket_messages = TicketMessage.objects.filter(ticket=obj) 
        attachments = TicketAttachment.objects.filter(message__in=ticket_messages)
        return TicketAttachmentSerializer(attachments, many=True).data 

        
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
    attachments = TicketAttachmentSerializer(source="ticketattachment_set", many=True, read_only=True)

    class Meta:
        model = TicketMessage
        fields = ["sender_profile", "ticket", "message_body", "created_at", "attachments"]


class NotificationSerializer(serializers.ModelSerializer):
    user_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    ticket_subject = serializers.CharField(source="ticket.subject",read_only=True)
    class Meta:
        model = Notification
        fields = ["id","user_profile", "ticket_subject" ,"message", "created_at", "read_status"]
        extra_kwargs = {"student": {"read_only": True}}


class ChangeTicketDateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    due_date = serializers.DateTimeField()

    def create(self, validated_data):
        return validated_data

class TicketStatusHistorySerializer(serializers.ModelSerializer):
    profile_username = serializers.CharField(source="changed_by_profile.username", read_only=True)
    class Meta:
        model = TicketStatusHistory
        fields = ["old_status", "new_status", "profile_username","changed_at","notes"]
        extra_kwargs = {"ticket": {"read_only": True}}

        