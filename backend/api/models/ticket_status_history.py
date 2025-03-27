from django.db import models
from django.contrib.auth.models import User
from .ticket import Ticket

class TicketStatusHistory(models.Model):
    """  
    Maintains audit log of ticket status changes.

Fields:
    - ticket: Related Ticket instance
    - old_status: Previous status value
    - new_status: Updated status value
    - changed_by_profile: User who made change
    - changed_at: Timestamp of change
    - notes: Optional change description
    """  
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    old_status = models.CharField(max_length=50, null=True)
    new_status = models.CharField(max_length=50)
    changed_by_profile = models.ForeignKey(User, on_delete=models.CASCADE)
    changed_at = models.DateTimeField(auto_now=True)
    notes = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Ticket #{self.ticket.id} from {self.old_status} to {self.new_status}"