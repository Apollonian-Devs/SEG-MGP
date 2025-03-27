from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone

STATUS_CHOICES = [
    ("Open", "Open"),
    ("In Progress", "In Progress"),
    ("Awaiting Student", "Awaiting Student"),
    ("Closed", "Closed"),
]

PRIORITY_CHOICES = [
    ("Low", "Low"),
    ("Medium", "Medium"),
    ("High", "High"),
]

def get_default_superuser():
    return User.objects.filter(is_superuser=True).first()

class Ticket(models.Model):
    """  
    Represents a support ticket in the system.

Fields:
    - subject: Brief ticket summary
    - description: Detailed ticket information
    - created_by: User who opened the ticket
    - assigned_to: User responsible for ticket
    - status: Current workflow state
    - priority: Importance level
    - created_at/updated_at/closed_at: Timestamps
    - due_date: Expected resolution time
    - is_overdue: Flag for overdue tickets

Methods:
    - save: Validates ticket creator and updates timestamps
    - __str__: Returns ticket subject

Meta:
    - Constraints: Validates status and priority values
    """  
    subject = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets_created')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, default=get_default_superuser, null=True, blank=True, related_name='tickets_assigned')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Open")
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    is_overdue = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.created_by.is_staff or self.created_by.is_superuser:
            raise ValidationError("Only student users can create tickets.")
        if self.status == "Closed" and self.closed_at is None:
            self.closed_at = timezone.now()
        self.is_overdue = bool(self.due_date and self.due_date < timezone.now())
        super().save(*args, **kwargs)

    def __str__(self):
        return self.subject

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(status__in=[choice[0] for choice in STATUS_CHOICES]),
                name="valid_ticket_status"
            ),
            models.CheckConstraint(
                check=models.Q(priority__in=[choice[0] for choice in PRIORITY_CHOICES]) | models.Q(priority__isnull=True),
                name="valid_ticket_priority"
            )
        ]