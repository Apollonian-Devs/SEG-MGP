from django.db import models
from .ticket_message import TicketMessage

class TicketAttachment(models.Model):
    message = models.ForeignKey(TicketMessage, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment #{self.id} on Msg {self.message.id}"