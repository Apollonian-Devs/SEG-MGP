from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    """  
    Serializes notification data with ticket context.

Fields:
    - id: Notification ID
    - user_profile: Recipient user ID
    - ticket_subject: Related ticket subject (read-only)
    - message: Notification content
    - created_at: Timestamp
    - read_status: Viewed state

Meta:
    - extra_kwargs: Makes student field read-only
    """  
    user_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    ticket_subject = serializers.CharField(source="ticket.subject", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "user_profile", "ticket_subject", "message", "created_at", "read_status"]
        extra_kwargs = {"student": {"read_only": True}}