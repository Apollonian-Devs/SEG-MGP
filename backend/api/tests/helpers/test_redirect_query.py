from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, ValidationError
from api.helpers import redirect_query
from api.models import Ticket

"""
def redirect_query(ticket, from_user, to_user):
    if ticket.status == "Closed":
        raise ValidationError("Redirection failed: Closed tickets cannot be redirected.")
    
    validate_redirection(from_user, to_user)

    ticket.assigned_to = to_user
    ticket.updated_at = timezone.now()
    ticket.save()


    TicketRedirect.objects.create(
        ticket=ticket,
        from_profile=from_user,
        to_profile=to_user,
    )


    Notification.objects.create(
        user_profile=to_user,
        ticket=ticket,
        message=f"Ticket #{ticket.id} has been redirected to you by {from_user.username}.",
    )

    send_email(to_user, 'Testing Redirection', 'Body message test')


    return ticket



    





class Ticket(models.Model):
    
    subject = models.CharField(max_length=255)
    description = models.TextField()

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tickets_created'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        default=get_default_superuser,
        null=True,
        blank=True,
        related_name='tickets_assigned'
    )

    #category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Open")
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    is_overdue = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # 1) Enforce only students can create tickets
        if self.created_by.is_staff or self.created_by.is_superuser:
            raise ValidationError("Only student users can create tickets.")
        
        # 2) If status is "Closed" but closed_at not set, set closed_at to now
        if self.status == "Closed" and self.closed_at is None:
            self.closed_at = timezone.now()

        # 3) If due_date is in the past, set is_overdue to True, else False
        if self.due_date and self.due_date < timezone.now():
            self.is_overdue = True
        else:
            self.is_overdue = False

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

"""

from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Ticket
from django.utils import timezone

class TestValidateRedirection(TestCase):

    def setUp(self):
        """
        Set up test users and a ticket.
        """
        # Create Users
        self.student_user = User.objects.create_user(username="student", email="student@gmail.com", password="password")
        self.staff_user = User.objects.create_user(username="staff", email="staff@gmail.com", password="password", is_staff=True)
        self.admin_user = User.objects.create_user(username="admin", email="admin@gmail.com", password="password", is_superuser=True)

        # Create a Test Ticket
        self.ticket = Ticket.objects.create(
            subject="Test Subject",
            description="Test Description",
            created_by=self.student_user, 
            assigned_to=self.staff_user,  
            status="Open",
            priority="Medium", 
            due_date=timezone.now() + timezone.timedelta(days=3) 
        )


