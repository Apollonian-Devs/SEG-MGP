'''def get_ticket_path(admin_user, ticket):
    """
    Return list of all path changes for a given ticket.
    """
    if not admin_user.is_superuser:
        raise PermissionDenied("Only admins can view ticket path.")

    if ticket is None:
        raise ValueError("Invalid ticket provided.")


    path = TicketRedirect.objects.filter(ticket=ticket)


    return path
'''


from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from api.models import Ticket, TicketRedirect
from api.helpers import get_ticket_path


class TicketPathHistory(TestCase):

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

        self.history1 = TicketRedirect.objects.create(
            ticket=self.ticket,
            from_profile=self.officer,
            to_profile=self.admin
        )

        self.history2 = TicketRedirect.objects.create(
            ticket=self.ticket,
            from_profile=self.admin,
            to_profile=self.officer
        )

        self.history3 = TicketRedirect.objects.create(
            ticket=self.ticket,
            from_profile=self.officer,
            to_profile=self.student
        )

    def test_ticket_is_none(self):
        """Test passing None instead of a valid ticket"""
        with self.assertRaises(ValueError):
            get_ticket_path(self.admin, None)

    def test_if_only_staff_member_cant_getTicketPath_ticket(self):
        """Test if a staff member (not superuser) cannot view ticket path"""
        with self.assertRaises(PermissionDenied):
            get_ticket_path(self.officer, self.ticket)

    def test_if_superuser_can_getTicketPath_ticket(self):
        """Test if an admin (superuser) can retrieve ticket path history"""
        path = get_ticket_path(self.admin, self.ticket)
        self.assertEqual(len(path), 3)

    def test_if_student_cant_get_getTicketPath_ticket(self):
        """Test if a student (normal user) is denied access to ticket path"""
        with self.assertRaises(PermissionDenied):
            get_ticket_path(self.student, self.ticket)

    def test_if_ticketPath_query_set_is_returned_correctly(self):
        """Test the returned ticket path"""
        path = get_ticket_path(self.admin, self.ticket)
        ids = [redirect.id for redirect in path]
        self.assertEqual(ids, sorted(ids, reverse=True))


