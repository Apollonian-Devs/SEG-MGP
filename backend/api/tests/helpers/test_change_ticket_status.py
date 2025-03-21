from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from api.models import Ticket, TicketStatusHistory
from api.helpers import changeTicketStatus  # Import the function under test

class ChangeTicketStatusTests(TestCase):
    def setUp(self):
        """Set up test users and a ticket"""
        self.student = User.objects.create_user(username="student", password="test123")
        self.officer = User.objects.create_user(username="officer", password="test123", is_staff=True)
        self.admin = User.objects.create_superuser(username="admin", password="test123")

        # Set a valid status during creation
        self.ticket = Ticket.objects.create(
            subject="Status Test Ticket",
            description="Testing status changes",
            created_by=self.student,
            assigned_to=self.officer,
            status="Open" 
        )


    def test_student_cannot_change_status(self):
        """Test that a student user gets PermissionDenied when trying to change status."""
        with self.assertRaises(PermissionDenied):
            changeTicketStatus(self.ticket, self.student)

    def test_status_cycles_correctly(self):
        """Test that status cycles through Open → In Progress → Awaiting Student → Closed → Open"""
        self.ticket.status = "Open"
        self.ticket.save()
        changeTicketStatus(self.ticket, self.officer)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, "In Progress")

        changeTicketStatus(self.ticket, self.officer)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, "Awaiting Student")

        changeTicketStatus(self.ticket, self.officer)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, "Closed")

        changeTicketStatus(self.ticket, self.officer)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, "Open")  

    def test_ticket_status_history_is_logged(self):
        """Test that a history record is created when status changes."""
        old_status = self.ticket.status
        changeTicketStatus(self.ticket, self.officer)

        history_entry = TicketStatusHistory.objects.filter(ticket=self.ticket).last()
        self.assertIsNotNone(history_entry)
        self.assertEqual(history_entry.old_status, old_status)  # Old status should be correct
        self.assertEqual(history_entry.new_status, self.ticket.status)  # New status should match updated ticket status
        self.assertIn(f"Status changed from {old_status} to {self.ticket.status}", history_entry.notes)

    def test_change_ticket_status_from_none_unsaved(self):
        # Use existing officer user
        officer = self.officer

    
        ticket = Ticket(
            subject="Unsaved Ticket",
            description="Testing default status fallback",
            created_by=self.student,
            assigned_to=officer
        )
        ticket.status = None 

        changeTicketStatus(ticket, officer)

        self.assertEqual(ticket.status, "Open")


