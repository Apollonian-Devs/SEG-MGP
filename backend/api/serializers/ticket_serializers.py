from rest_framework import serializers
from api.models import Ticket, TicketMessage, TicketAttachment
from .message_serializers import TicketAttachmentSerializer

class TicketSerializer(serializers.ModelSerializer):
    """  
    Serializes ticket data with message and attachment handling.

Fields:
    - Standard ticket fields
    - message: Initial message (write-only)
    - attachments: Attachment data (write-only)
    - attachment_list: Attachment details (read-only)

Methods:
    - get_attachment_list: Retrieves all ticket attachments
    """  
    message = serializers.CharField(required=False, write_only=True)
    attachments = serializers.ListField(
        child=serializers.DictField(), required=False, write_only=True
    )
    attachment_list = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id", "subject", "description", "created_by", "assigned_to", "status",
            "priority", "created_at", "updated_at", "closed_at", "due_date", "is_overdue",
            "message", "attachments", "attachment_list"
        ]
        extra_kwargs = {
            "created_by": {"read_only": True},
            "subject": {"required": True},
            "description": {"required": True},
        }

    def get_attachment_list(self, obj):
        ticket_messages = TicketMessage.objects.filter(ticket=obj)
        attachments = TicketAttachment.objects.filter(message__in=ticket_messages)
        return TicketAttachmentSerializer(attachments, many=True).data

class ChangeTicketDateSerializer(serializers.Serializer):
    """  
    Validates ticket due date changes.

Fields:
    - id: Ticket ID
    - due_date: New due date

Methods:
    - create: Returns validated data (no model creation)
    """  
    id = serializers.IntegerField()
    due_date = serializers.DateTimeField()

    def create(self, validated_data):
        return validated_data