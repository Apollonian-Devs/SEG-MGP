from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Ticket  # Ensure this matches your actual project structure
from api.helpers import get_tickets_for_user  # Adjust import path if needed
from django.utils import timezone
from datetime import timedelta

class GetTicketsForUserTests(TestCase):
    def setUp(self):
        """Set up test users and tickets"""
        self.student = User.objects.create_user(username="@student1", password="1234")
        self.officer1 = User.objects.create_user(username="@officer1", password="1234", is_staff=True)
        self.officer2 = User.objects.create_user(username="@officer2", password="1234", is_staff=True)
        self.admin = User.objects.create_superuser(username="@admin1", password="1234", is_staff=True, is_superuser=True)

        # Student creates two tickets
        self.student_ticket1 = Ticket.objects.create(
            subject="Student Ticket 1",
            description="Description 1",
            created_by=self.student,
            assigned_to=self.officer1,
            status="Open",
            priority="Low",
            created_at=timezone.now(),
            updated_at=timezone.now(),
            due_date=timezone.now() + timedelta(days=5),
            is_overdue=False
        )
        self.student_ticket2 = Ticket.objects.create(
            subject="Student Ticket 2",
            description="Description 2",
            created_by=self.student,
            assigned_to=self.officer2,
            status="In Progress",
            priority="High",
            created_at=timezone.now(),
            updated_at=timezone.now(),
            due_date=timezone.now() - timedelta(days=1),
            is_overdue=True
        )
        self.student_ticket3 = Ticket.objects.create(
            subject="Student Ticket 3",
            description="Description 3",
            created_by=self.student,
            assigned_to=self.admin,
            status="Open",
            priority="Low",
            created_at=timezone.now(),
            updated_at=timezone.now(),
            due_date=timezone.now() + timedelta(days=5),
            is_overdue=False
        )


    def test_student_sees_own_tickets(self):
        """Students should only see tickets they created"""
        tickets = get_tickets_for_user(self.student)

        self.assertEqual(len(tickets), 3)
        self.assertEqual(tickets[0]["id"], self.student_ticket1.id)
        self.assertEqual(tickets[1]["id"], self.student_ticket2.id)
        self.assertEqual(tickets[2]["id"], self.student_ticket3.id)

    def test_closed_at_field_is_returned_correctly(self):
        """Ensure closed_at is included and reflects actual status"""
        self.student_ticket1.status = "Closed"
        self.student_ticket1.closed_at = timezone.now()
        self.student_ticket1.save()

        tickets = get_tickets_for_user(self.student)

        # Find the closed one
        closed_ticket = next((t for t in tickets if t["id"] == self.student_ticket1.id), None)
        self.assertIsNotNone(closed_ticket)
        self.assertIsNotNone(closed_ticket["closed_at"])


    def test_officer_sees_assigned_tickets(self):
        """Officers should only see tickets assigned to them"""
        tickets = get_tickets_for_user(self.officer1)

        self.assertEqual(len(tickets), 1)
        self.assertEqual(tickets[0]["id"], self.student_ticket1.id)


    def test_admin_sees_assigned_tickets(self):
        """Admins should only see tickets assigned to them"""
        tickets = get_tickets_for_user(self.admin)

        self.assertEqual(len(tickets), 1)
        self.assertEqual(tickets[0]["id"], self.student_ticket3.id)
