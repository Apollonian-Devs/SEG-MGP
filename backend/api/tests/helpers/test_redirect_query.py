from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, ValidationError
from unittest.mock import patch, MagicMock
from django.utils import timezone
from api.helpers import redirect_query
from api.models import Ticket, TicketRedirect, Notification

class TestRedirectQuery(TestCase):

    def setUp(self):
        """
        Set up test users and a ticket.
        """

        self.student_user = User.objects.create_user(username="student", email="student@gmail.com", password="password")
        self.staff_user = User.objects.create_user(username="staff", email="staff@gmail.com", password="password", is_staff=True)
        self.staff_user2 = User.objects.create_user(username="staff2", email="staff2@gmail.com", password="password", is_staff=True)
        self.admin_user = User.objects.create_superuser(username="admin", email="admin@gmail.com", password="password", is_superuser=True)

        self.ticket = Ticket.objects.create(
            subject="Test Subject",
            description="Test Description",
            created_by=self.student_user,
            assigned_to=self.staff_user,
            status="Open",
            priority="Medium",
            due_date=timezone.now() + timezone.timedelta(days=3)
        )

    def test_redirection_fails_if_ticket_is_closed(self):
        """ Test that redirection fails if the ticket is closed. """
        self.ticket.status = "Closed"
        self.ticket.save()
        
        with self.assertRaises(ValidationError) as context:
            redirect_query(self.ticket, self.staff_user, self.staff_user2)
        
        self.assertEqual(context.exception.messages[0], "Redirection failed: Closed tickets cannot be redirected.")
        
    def test_officer_can_redirect_within_same_department(self):
        """ Test that a staff member can redirect a ticket to another staff member. """
        redirect_query(self.ticket, self.staff_user, self.staff_user2)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.assigned_to, self.staff_user2)

    def test_admin_can_redirect_to_any_department(self):
        """ Test that an admin can redirect a ticket to any user. """
        redirect_query(self.ticket, self.admin_user, self.student_user)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.assigned_to, self.student_user)

    def test_redirection_fails_if_same_user(self):
        """ Test that a ticket cannot be redirected to the same user. """
        with self.assertRaises(ValidationError) as context:
            redirect_query(self.ticket, self.staff_user, self.staff_user)
        
        self.assertEqual(context.exception.messages[0], "Redirection failed: Cannot redirect the ticket to the same user.")


    def test_ticket_redirect_object_created(self):
        """ Ensure a TicketRedirect object is created after redirection. """
        redirect_query(self.ticket, self.staff_user, self.staff_user2)
        self.assertEqual(TicketRedirect.objects.count(), 1)
        redirect_entry = TicketRedirect.objects.first()
        self.assertEqual(redirect_entry.from_profile, self.staff_user)
        self.assertEqual(redirect_entry.to_profile, self.staff_user2)

    def test_notification_created_on_redirection(self):
        """ Ensure a notification is created when a ticket is redirected. """
        redirect_query(self.ticket, self.staff_user, self.staff_user2)
        self.assertEqual(Notification.objects.count(), 1)
        notification = Notification.objects.first()
        self.assertEqual(notification.user_profile, self.staff_user2)
        self.assertIn("Ticket #", notification.message)

    @patch("api.helpers.yagmail.SMTP")
    def test_email_sent_on_redirection(self, mock_yagmail):
        """ Ensure an email is sent to the new assignee upon redirection. """
        mock_smtp_instance = MagicMock()
        mock_yagmail.return_value = mock_smtp_instance

        redirect_query(self.ticket, self.staff_user, self.staff_user2)

        mock_smtp_instance.send.assert_called_once_with(
            to=self.staff_user2.email,
            subject="Redirection of ticket",
            contents=f"Ticket #{self.ticket.id} has been redirected to you by {self.staff_user.username}.",
        )

    def test_unauthorized_user_cannot_redirect(self):
        """ Test that a student cannot redirect a ticket. """
        with self.assertRaises(PermissionDenied) as context:
            redirect_query(self.ticket, self.student_user, self.staff_user)

        self.assertEqual(str(context.exception), "Only officers or admins can redirect tickets.")

    def test_ticket_assigned_to_is_updated(self):
        """ Ensure the assigned_to field updates correctly. """
        redirect_query(self.ticket, self.staff_user, self.staff_user2)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.assigned_to, self.staff_user2)

    def test_ticket_updated_at_changes_after_redirection(self):
        """ Ensure the updated_at timestamp changes after redirection. """
        old_updated_at = self.ticket.updated_at
        redirect_query(self.ticket, self.staff_user, self.staff_user2)
        self.ticket.refresh_from_db()
        self.assertNotEqual(self.ticket.updated_at, old_updated_at)

    def test_redirection_fails_with_none_user(self):
        """ Ensure redirection fails if from_user or to_user is None. """
        with self.assertRaises(PermissionDenied):
            redirect_query(self.ticket, None, self.staff_user)
        
        with self.assertRaises(PermissionDenied):
            redirect_query(self.ticket, self.staff_user, None)

