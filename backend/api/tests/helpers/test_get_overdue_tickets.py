from datetime import timedelta
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from api.models import Ticket
from api.helpers import get_overdue_tickets
from unittest.mock import patch

class OverdueTicketsTests(TestCase):
    def setUp(self):
        self.student = User.objects.create_user(username="student", password="test123")
        self.staff   = User.objects.create_user(username="staff",   password="test123", is_staff=True)
        self.admin   = User.objects.create_superuser(username="admin", password="test123")

        # Tickets actually created by the student
        self.student_overdue_ticket = Ticket.objects.create(
            subject="Overdue Student Ticket",
            description="...",
            created_by=self.student,
            assigned_to=self.staff,
            due_date=timezone.now() - timedelta(days=2),
            is_overdue=False,
        )
        self.student_future_ticket = Ticket.objects.create(
            subject="Future Student Ticket",
            description="...",
            created_by=self.student,
            assigned_to=self.staff,
            due_date=timezone.now() + timedelta(days=3),
            is_overdue=False,
        )


    def test_none_user_raises_permission_denied(self):
        with self.assertRaises(PermissionDenied):
            get_overdue_tickets(None)

    @patch("django.utils.timezone.now")
    def test_student_sees_overdue_tickets_they_created(self, mock_now):
        """Simulate the system thinking today is 5 days ahead"""
        mock_now.return_value = timezone.make_aware(
            timezone.datetime.now() + timedelta(days=5)
        )
        qs = get_overdue_tickets(self.student)
        self.student_overdue_ticket.refresh_from_db()
        self.student_future_ticket.refresh_from_db()

        self.assertEqual(qs.count(), 2)
        self.assertIn(self.student_overdue_ticket, qs)
        self.assertIn(self.student_future_ticket, qs)

    @patch("django.utils.timezone.now")
    def test_staff_sees_overdue_tickets_assigned_to_them(self, mock_now):
        mock_now.return_value = timezone.make_aware(
            timezone.datetime.now() + timedelta(days=5)
        )
        qs = get_overdue_tickets(self.staff)
        self.student_overdue_ticket.refresh_from_db()
        self.student_future_ticket.refresh_from_db()

        self.assertEqual(qs.count(), 2)
        self.student_overdue_ticket.refresh_from_db()
        self.student_future_ticket.refresh_from_db()


    @patch("django.utils.timezone.now")
    def test_admin_sees_no_overdue_tickets_if_none_assigned(self, mock_now):
        mock_now.return_value = timezone.make_aware(
            timezone.datetime.now() + timedelta(days=5)
        )
        qs = get_overdue_tickets(self.admin)
        self.assertEqual(qs.count(), 0)

    @patch("django.utils.timezone.now")
    def test_non_staff_member_gets_empty_queryset_if_their_tickets_are_not_overdue(self, mock_now):
        mock_now.return_value = timezone.make_aware(
            timezone.datetime.now() + timedelta(days=5)
        )
        Ticket.objects.filter(created_by=self.student).update(due_date=timezone.now() + timedelta(days=10))
        qs = get_overdue_tickets(self.student)
        self.assertEqual(qs.count(), 0)

    @patch("django.utils.timezone.now")
    def test_staff_member_gets_empty_queryset_if_no_overdue_tickets_assigned(self, mock_now):
        mock_now.return_value = timezone.make_aware(
            timezone.datetime.now() + timedelta(days=5)
        )
        Ticket.objects.filter(assigned_to=self.staff).update(due_date=timezone.now() + timedelta(days=10))
        qs = get_overdue_tickets(self.staff)
        self.assertEqual(qs.count(), 0)

    @patch("django.utils.timezone.now")
    def test_is_overdue_field_is_updated_correctly(self, mock_now):
        mock_now.return_value = timezone.make_aware(
            timezone.datetime.now() + timedelta(days=5)
        )
        # Before calling helper, ticket is not overdue yet.
        self.student_future_ticket.refresh_from_db()
        self.assertFalse(self.student_future_ticket.is_overdue)

        # Call the function to update overdue statuses
        get_overdue_tickets(self.student)

        self.student_future_ticket.refresh_from_db()
        self.assertTrue(self.student_future_ticket.is_overdue)

    def test_ticket_due_date_consistency(self):
        get_overdue_tickets(self.student)
        self.student_overdue_ticket.refresh_from_db()
        self.assertTrue(self.student_overdue_ticket.is_overdue)
