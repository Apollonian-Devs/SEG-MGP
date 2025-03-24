from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from api.models import Ticket, TicketStatusHistory
from api.helpers import changeTicketPriority 


class ChangeTicketPriorityTests(TestCase):
    def setUp(self):
        """Set up test users and a ticket"""
        self.student = User.objects.create_user(username="student", password="test123")
        self.officer = User.objects.create_user(username="officer", password="test123",is_staff=True)
        self.admin = User.objects.create_superuser(username="admin", password="test123")

        self.ticket = Ticket.objects.create(
            subject="Priority Test Ticket",
            description="Testing priority changes",
            created_by=self.student,
            assigned_to=self.officer,
            priority=None  
        )

    def test_student_cannot_change_priority(self):
        """Test that a student user gets PermissionDenied when trying to change priority."""
        with self.assertRaises(PermissionDenied):
            changeTicketPriority(self.ticket, self.student)

    def test_priority_changes_from_none_to_low(self):
        """Test that if priority is None, it becomes 'Low'"""
        changeTicketPriority(self.ticket, self.officer)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.priority, "Low")

    def test_priority_cycles_correctly(self):
        """Test that priority cycles through Low → Medium → High → Low"""
        self.ticket.priority = "Low"
        self.ticket.save()
        changeTicketPriority(self.ticket, self.officer)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.priority, "Medium")

        changeTicketPriority(self.ticket, self.officer)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.priority, "High")

        changeTicketPriority(self.ticket, self.officer)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.priority, "Low")  # Circular queue behavior

    def test_ticket_status_history_is_logged(self):
        """Test that a history record is created when priority changes."""
        old_priority = self.ticket.priority
        changeTicketPriority(self.ticket, self.officer)

        history_entry = TicketStatusHistory.objects.filter(ticket=self.ticket).last()
        self.assertIsNotNone(history_entry)
        self.assertEqual(history_entry.old_status, self.ticket.status)  # Status remains unchanged
        self.assertEqual(history_entry.new_status, self.ticket.status)
        self.assertIn(f"Priority changed from {old_priority} to {self.ticket.priority}", history_entry.notes)
