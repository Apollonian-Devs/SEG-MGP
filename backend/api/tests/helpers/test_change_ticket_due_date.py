from datetime import timedelta
from unittest.mock import patch
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from api.models import Ticket, TicketStatusHistory, Notification
from api.helpers import changeTicketDueDate  # Assuming this is the function being tested

class NotificationTests(TestCase):
    def setUp(self):
        """Set up test users and tickets"""
        self.student = User.objects.create_user(username="student", password="test123")
        self.officer = User.objects.create_user(username="officer", password="test123", is_staff=True)
        self.admin = User.objects.create_superuser(username="admin", password="test123")

        self.overdue_ticket = Ticket.objects.create(
            subject="Overdue Ticket",
            description="This is an overdue ticket",
            created_by=self.student,
            assigned_to=self.officer,
            due_date=timezone.now() - timedelta(days=1),  # Past date
            is_overdue=True
        )

        self.future_ticket = Ticket.objects.create(
            subject="Future Ticket",
            description="This ticket has a future due date",
            created_by=self.student,
            assigned_to=self.officer,
            due_date=timezone.now() + timedelta(days=5),  # Future date
            is_overdue=False
        )

    def test_student_cant_change_due_date(self):
        """Test that students cannot change the due date of a ticket"""
        new_due_date = timezone.now() + timedelta(days=7)
        with self.assertRaises(PermissionDenied):
            changeTicketDueDate(self.overdue_ticket, self.student, new_due_date)

    def test_officer_cant_put_due_date_in_past(self):
        """Test that an officer cannot set the due date to a past date"""
        new_due_date = timezone.now() - timedelta(days=1)
        with self.assertRaises(ValueError):
            changeTicketDueDate(self.future_ticket, self.officer, new_due_date)

    def test_officer_can_change_due_date_in_future(self):
        """Test that an officer can change the due date to a future date"""
        new_due_date = timezone.now() + timedelta(days=10)
        updated_ticket = changeTicketDueDate(self.future_ticket, self.officer, new_due_date)
        self.assertEqual(updated_ticket.due_date, new_due_date)

    def test_superuser_can_change_due_date_in_future(self):
        """Test that a superuser can change the due date"""
        new_due_date = timezone.now() + timedelta(days=15)
        updated_ticket = changeTicketDueDate(self.future_ticket, self.admin, new_due_date)
        self.assertEqual(updated_ticket.due_date, new_due_date)

    def test_ticket_status_history_table_updated_when_status_not_awaiting_student(self):
        """Test that status history is recorded if the status isn't 'Awaiting Student'"""
        new_due_date = timezone.now() + timedelta(days=10)
        changeTicketDueDate(self.overdue_ticket, self.officer, new_due_date)

        history_entry = TicketStatusHistory.objects.filter(ticket=self.overdue_ticket).last()
        self.assertIsNotNone(history_entry)
        self.assertEqual(history_entry.new_status, "Awaiting Student")

    def test_ticket_status_history_not_created_if_already_awaiting_student(self):
        """Test that no new status history entry is created if the ticket is already 'Awaiting Student'."""
        self.overdue_ticket.status = "Awaiting Student"
        self.overdue_ticket.save()

        new_due_date = timezone.now() + timedelta(days=10)

        history_count_before = TicketStatusHistory.objects.filter(ticket=self.overdue_ticket).count()

        changeTicketDueDate(self.overdue_ticket, self.officer, new_due_date)

        history_count_after = TicketStatusHistory.objects.filter(ticket=self.overdue_ticket).count()

        self.assertEqual(history_count_before, history_count_after)

    def test_notification_created_when_due_date_updated(self):
        """Test that a notification is created when a due date is updated"""
        new_due_date = timezone.now() + timedelta(days=10)
        changeTicketDueDate(self.future_ticket, self.officer, new_due_date)

        notification = Notification.objects.filter(user_profile=self.future_ticket.created_by).last()
        self.assertIsNotNone(notification)
        self.assertIn("Due date has been set/updated", notification.message)

    @patch("api.helpers.notification_helpers.send_email")  
    def test_email_is_sent_with_new_due_date(self, mock_send_email):
        """Test that an email is sent when the due date is updated"""
        new_due_date = timezone.now() + timedelta(days=10)

        changeTicketDueDate(self.future_ticket, self.officer, new_due_date)

        mock_send_email.assert_called_once()

        recipient, subject, body = mock_send_email.call_args[0]

        self.assertEqual(recipient, self.future_ticket.created_by)
        self.assertIn("Your due date of the ticket", subject)
        self.assertIsInstance(body, str)


