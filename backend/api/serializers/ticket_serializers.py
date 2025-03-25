from rest_framework import serializers
from api.models import Ticket, TicketMessage, TicketAttachment
from .message_serializers import TicketAttachmentSerializer

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
        ticket_messages = TicketMessage.objects.filter(ticket=obj)
        attachments = TicketAttachment.objects.filter(message__in=ticket_messages)
        return TicketAttachmentSerializer(attachments, many=True).data

class ChangeTicketDateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    due_date = serializers.DateTimeField()

    def create(self, validated_data):
        return validated_data
        