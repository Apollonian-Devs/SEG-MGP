from django.test import TestCase
from django.db import IntegrityError
from django.contrib.auth.models import User
from api.models import Department, Ticket, TicketRedirect


class TicketRedirectTests(TestCase):
    def setUp(self):
        self.student = User.objects.create_user(username="student")
        self.officer1 = User.objects.create_user(username="officer1")
        self.officer2 = User.objects.create_user(username="officer2")
        self.department = Department.objects.create(name="IT")
        self.ticket = Ticket.objects.create(
            subject="Test Ticket",
            description="Test Description",
            created_by=self.student,
            assigned_to=self.officer1
        )

    def test_create_ticket_redirect(self):
        redirect = TicketRedirect.objects.create(
            ticket=self.ticket,
            from_profile=self.officer1,
            to_profile=self.officer2
        )
        self.assertEqual(redirect.ticket, self.ticket)
        self.assertEqual(redirect.from_profile, self.officer1)
        self.assertEqual(redirect.to_profile, self.officer2)
        self.assertEqual(
            str(redirect),
            f"Redirect #{redirect.id} for Ticket #{self.ticket.id}"
        )