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

    def test_redirection_if_ticket_is_closed():
        pass


    @patch("api.helpers.yagmail.SMTP")
    def test_send_response_create_notification_for_staff(self, mock_yagmail):
        """ Test email sending for staff responses. """
        ticket = Ticket.objects.create(
            created_by=self.student_user, subject="Test Subject", description="Test Description", status="Open"
        )

        mock_smtp_instance = MagicMock()
        mock_yagmail.return_value = mock_smtp_instance 

        redirect_query(self.staff_user, ticket, "Test Message Body")

 
        self.assertEqual(Notification.objects.count(), 1)

    
        mock_smtp_instance.send.assert_called_once_with(
            to=self.student_user.email,
            subject="Message Recieved",
            contents=f"Staff replied on Ticket #{ticket.id}",
        )



