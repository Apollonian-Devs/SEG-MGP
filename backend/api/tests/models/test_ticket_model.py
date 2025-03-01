from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from time import sleep
from datetime import timedelta

from django.contrib.auth.models import User
from api.models import Ticket

class TicketTestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpassword'
        )

        self.ticket = Ticket.objects.create(
            subject='Test Ticket',
            description='This is a test ticket',
            created_by=self.user1,
            assigned_to=self.user2,
            status='Open',
            priority='Low'
        )

    # 1) String representation
    def test_ticket_str(self):
        self.assertEqual(str(self.ticket), self.ticket.subject)

    # 2) Basic validity check
    def test_valid_ticket_is_valid(self):
        try:
            self.ticket.full_clean()
        except ValidationError:
            self.fail("Default test Ticket should be deemed valid")

    # 3) Subject required
    def test_invalid_ticket_raises_validation_error(self):
        self.ticket.subject = ''
        with self.assertRaises(ValidationError):
            self.ticket.full_clean()

    # 4) assigned_to can be None
    def test_ticket_with_no_assigned_to_is_valid(self):
        self.ticket.assigned_to = None
        try:
            self.ticket.full_clean()
        except ValidationError:
            self.fail("Ticket with no assigned_to should be valid (fallback to default superuser)")

    # 5) priority can be empty
    def test_ticket_with_no_priority_is_valid(self):
        self.ticket.priority = ''
        try:
            self.ticket.full_clean()
        except ValidationError:
            self.fail("Ticket with empty priority should still be valid")

    # 6) status cannot be None
    def test_ticket_with_no_status_is_invalid(self):
        self.ticket.status = None
        with self.assertRaises(ValidationError):
            self.ticket.full_clean()

    # 7) created_by cannot be None
    def test_ticket_with_no_created_by_is_invalid(self):
        self.ticket.created_by = None
        with self.assertRaises(ValidationError):
            self.ticket.full_clean()

    # 8) Staff user cannot create a ticket
    def test_ticket_with_staff_created_by_is_invalid(self):
        self.ticket.created_by.is_staff = True
        self.ticket.created_by.save()
        with self.assertRaises(ValidationError):
            self.ticket.save()

    # 9) Superuser cannot create a ticket
    def test_ticket_with_superuser_created_by_is_invalid(self):
        self.ticket.created_by.is_superuser = True
        self.ticket.created_by.save()
        with self.assertRaises(ValidationError):
            self.ticket.save()

    # 10) Default status is "Open"
    def test_ticket_default_status_is_open(self):
        ticket = Ticket.objects.create(
            subject="New Ticket",
            description="Testing default status",
            created_by=self.user1,
            assigned_to=self.user2
        )
        self.assertEqual(ticket.status, "Open")

    # 11) Default priority is None
    def test_ticket_default_priority_is_none(self):
        ticket = Ticket.objects.create(
            subject="Priority Test Ticket",
            description="Testing default priority",
            created_by=self.user1,
            assigned_to=self.user2
        )
        self.assertIsNone(ticket.priority)

    # 12) Default is_overdue is False
    def test_ticket_default_is_overdue_is_false(self):
        ticket = Ticket.objects.create(
            subject="Overdue Test Ticket",
            description="Testing default overdue status",
            created_by=self.user1,
            assigned_to=self.user2
        )
        self.assertFalse(ticket.is_overdue)

    # 13) updated_at changes on save
    def test_ticket_updated_at_changes_on_save(self):
        old_updated_at = self.ticket.updated_at
        sleep(1)  # Ensure at least 1s difference
        self.ticket.subject = "Updated Subject"
        self.ticket.save()
        self.ticket.refresh_from_db()
        self.assertNotEqual(old_updated_at, self.ticket.updated_at)

    # 14) Setting due_date in the past triggers is_overdue
    def test_ticket_overdue_status_changes(self):
        self.ticket.due_date = now() - timedelta(days=1)
        self.ticket.save()
        self.ticket.refresh_from_db()
        self.assertTrue(self.ticket.is_overdue)

    # 15) closed_at updates if status=Closed
    def test_ticket_closed_at_updates(self):
        self.ticket.status = "Closed"
        self.ticket.save()
        self.assertIsNotNone(self.ticket.closed_at)

    # 16) Reassigning ticket
    def test_ticket_reassignment(self):
        self.ticket.assigned_to = self.user1
        self.ticket.save()
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.assigned_to, self.user1)
