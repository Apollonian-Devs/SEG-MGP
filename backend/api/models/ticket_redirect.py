from django.db import models
from django.contrib.auth.models import User
from .ticket import Ticket

class TicketRedirect(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    from_profile = models.ForeignKey(User, on_delete=models.CASCADE, related_name='redirect_from')
    to_profile = models.ForeignKey(User, on_delete=models.CASCADE, related_name='redirect_to')

    def __str__(self):
        return f"Redirect #{self.id} for Ticket #{self.ticket.id}"
