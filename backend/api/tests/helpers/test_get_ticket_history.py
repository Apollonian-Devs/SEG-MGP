'''def get_ticket_history(admin_user, ticket):
    """
    Return a list of all status changes for a given ticket sorted by change date descending.
    """
    if not admin_user.is_superuser:
        raise PermissionDenied("Only admins can view ticket history.")
    
    if ticket is None:
        raise ValueError("Invalid ticket provided.")  # Changed to ValueError

    history = TicketStatusHistory.objects.filter(ticket=ticket).order_by("-changed_at")

    return history
'''

from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from api.models import Ticket, TicketStatusHistory
from api.helpers import get_ticket_history

class TicketMessageHistory(TestCase):

    def setUp(self):
        """Set up users and a ticket for testing"""
        self.student = User.objects.create_user(username="student", email="student@gmail.com", password="password")
        self.officer = User.objects.create_user(username="officer", email="officer@gmail.com", password="password")
        self.admin = User.objects.create_superuser(username="admin", email="admin@gmail.com", password="password")

        self.ticket = Ticket.objects.create(
            subject="Test Ticket",
            description="Test Description",
            created_by=self.student,
            assigned_to=self.officer,
            status="Open",
            priority="Medium",
            due_date=timezone.now() + timezone.timedelta(days=3)
        )

        
        self.history1 = TicketStatusHistory.objects.create(
            ticket=self.ticket,
            old_status=self.ticket.status,
            new_status="In Progress",
            changed_by_profile=self.admin, 
            changed_at=timezone.now() - timezone.timedelta(days=2)
        )

        self.history2 = TicketStatusHistory.objects.create(
            ticket=self.ticket,
            old_status="In Progress",
            new_status="Awaiting Student",
            changed_by_profile=self.admin, 
            changed_at=timezone.now() - timezone.timedelta(days=1)
        )

        self.history3 = TicketStatusHistory.objects.create(
            ticket=self.ticket,
            old_status="Awaiting Student",
            new_status="Closed",
            changed_by_profile=self.admin, 
            changed_at=timezone.now()
        )



    def test_ticket_is_none(self):
        """Test passing None instead of a valid ticket"""
        with self.assertRaises(ValueError): 
            get_ticket_history(self.admin, None)


    def test_if_only_staff_member_cant_get_ticket(self):
        """Test if a staff member (not superuser) cannot get ticket history"""
        with self.assertRaises(PermissionDenied):
            get_ticket_history(self.officer, self.ticket)

    def test_if_superuser_can_get_ticket(self):
        """Test if an admin (superuser) can retrieve ticket history"""
        history = get_ticket_history(self.admin, self.ticket)
        
        self.assertEqual(len(history), 3) 
        self.assertEqual(history[0].new_status, "Closed") 


    def test_if_student_can_get_ticket_history(self):
        """Test if a student (normal user) is denied access to ticket history"""
        with self.assertRaises(PermissionDenied):
            get_ticket_history(self.student, self.ticket)

    def test_if_history_query_set_is_returned_correctly_in_descending_order(self):
        """Test if the returned history is sorted in descending order"""
        history = get_ticket_history(self.admin, self.ticket)
        timestamps = [h.changed_at for h in history]
        self.assertEqual(timestamps, sorted(timestamps, reverse=True)) 
