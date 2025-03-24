from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import TicketMessage, Ticket, TicketAttachment

class TicketMessageSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = TicketAttachment
        fields = ["file_name", "file_path", "mime_type"]
        