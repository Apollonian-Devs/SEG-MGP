from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from time import sleep
from datetime import timedelta

from django.contrib.auth.models import User
from api.models import Ticket, TicketStatusHistory

class TicketStatusHistoryTestCase(TestCase):
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

        # Since changed_at now uses auto_now=True,
        # it will set the timestamp on creation and update on every save.
        self.status_history = TicketStatusHistory.objects.create(
            ticket=self.ticket,
            old_status='Open',
            new_status='In Progress',
            changed_by_profile=self.user2,
            notes='Ticket is being worked on'
        )

    def test_ticket_status_history_str(self):
        """Verify __str__ is correct."""
        expected_str = f"Ticket #{self.status_history.ticket.id} from {self.status_history.old_status} to {self.status_history.new_status}"
        self.assertEqual(str(self.status_history), expected_str)

    def test_valid_ticket_status_history_is_valid(self):
        """Check default TSH is valid."""
        try:
            self.status_history.full_clean()
        except ValidationError:
            self.fail("Default test TicketStatusHistory should be valid.")

    def test_no_old_status_raises_error(self):
        """old_status cannot be None."""
        self.status_history.old_status = None
        with self.assertRaises(ValidationError):
            self.status_history.full_clean()

    def test_no_new_status_raises_error(self):
        """new_status cannot be None."""
        self.status_history.new_status = None
        with self.assertRaises(ValidationError):
            self.status_history.full_clean()

    def test_no_changed_by_profile_raises_error(self):
        """changed_by_profile cannot be None."""
        self.status_history.changed_by_profile = None
        with self.assertRaises(ValidationError):
            self.status_history.full_clean()

    def test_no_notes_is_valid(self):
        """notes is optional."""
        self.status_history.notes = ''
        try:
            self.status_history.full_clean()
        except ValidationError:
            self.fail("TicketStatusHistory with no notes should still be valid.")

    def test_no_ticket_raises_error(self):
        """ticket cannot be None."""
        self.status_history.ticket = None
        with self.assertRaises(ValidationError):
            self.status_history.full_clean()

    def test_changed_at_updates_on_save(self):
        """With auto_now=True, changed_at should update each time we save."""
        old_changed_at = self.status_history.changed_at
        sleep(1)  # Ensure there's a noticeable time difference
        self.status_history.notes = "Updated notes"
        self.status_history.save()
        self.status_history.refresh_from_db()

        # Now changed_at should have changed
        self.assertNotEqual(old_changed_at, self.status_history.changed_at)
        self.assertTrue(self.status_history.changed_at > old_changed_at,
            "changed_at should be greater than the old timestamp after saving.")

    def test_can_manually_override_changed_at_if_needed(self):
        """
        If you allow manual overrides, you can test setting changed_at directly.
        Usually not recommended, but it depends on business logic.
        """
        custom_time = now() - timedelta(days=1)
        self.status_history.changed_at = custom_time
        self.status_history.save()
        self.status_history.refresh_from_db()
        # Because auto_now=True, the field will be updated upon save again, 
        # so you typically wouldn't see your custom_time remain.
        # If the field is forcibly overwritten, you won't keep that custom time.
        
        self.assertNotEqual(custom_time, self.status_history.changed_at, 
            "With auto_now=True, changed_at won't retain a manually set time on save.")
