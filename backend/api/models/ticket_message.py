from django.db import models
from django.contrib.auth.models import User
from .ticket import Ticket

class TicketMessage(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    sender_profile = models.ForeignKey(User, on_delete=models.CASCADE)
    message_body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_internal = models.BooleanField(default=False)

    def __str__(self):
        return f"Msg {self.id} on Ticket {self.ticket.id}"
