from django.db import models
from django.contrib.auth.models import User
from .ticket import Ticket

class Notification(models.Model):
    """  
    Tracks system notifications sent to users.

Fields:
    - user_profile: Recipient user
    - ticket: Related ticket (optional)
    - message: Notification content
    - created_at: Timestamp when notification was created
    - read_status: Whether notification has been read
    """  
    user_profile = models.ForeignKey(User, on_delete=models.CASCADE)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, null=True, blank=True)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    read_status = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification #{self.id} for {self.user_profile.username}"