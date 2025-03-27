from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import TicketMessage, Ticket, TicketAttachment

class TicketMessageSerializer(serializers.ModelSerializer):
    """  
    Serializes ticket message data including attachments.

Fields:
    - sender_profile: User ID of sender
    - ticket: Related ticket ID
    - message_body: Message content
    - created_at: Timestamp
    - attachments: List of related attachments (computed)

Methods:
    - get_attachments: Retrieves all attachments for message
    """  
    sender_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    ticket = serializers.PrimaryKeyRelatedField(queryset=Ticket.objects.all())
    attachments = serializers.SerializerMethodField()

    class Meta:
        model = TicketMessage
        fields = ["sender_profile", "ticket", "message_body", "created_at", "attachments"]

    def get_attachments(self, obj):
        attachments = TicketAttachment.objects.filter(message=obj)
        return TicketAttachmentSerializer(attachments, many=True).data

class TicketAttachmentSerializer(serializers.ModelSerializer):
    """  
    Serializes ticket attachment data.

Fields:
    - file_name: Original filename
    - file_path: Storage path
    - mime_type: File type
    """  
    class Meta:
        model = TicketAttachment
        fields = ["file_name", "file_path", "mime_type"]