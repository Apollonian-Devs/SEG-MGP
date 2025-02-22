from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from time import sleep
from datetime import timedelta

from django.contrib.auth.models import User
from api.models import Ticket, TicketMessage


class TicketMessageTestCase(TestCase):
    def setUp(self):
        # Create two users
        self.user1 = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpassword'
        )

        # Create a ticket
        self.ticket = Ticket.objects.create(
            subject='Test Ticket',
            description='This is a test ticket',
            created_by=self.user1,
            assigned_to=self.user2,
            status='Open',
            priority='Low'
        )

        # Create a ticket message
        self.ticket_message = TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.user1,
            message_body='Initial test message'
        )

    def test_ticket_message_str(self):
        """Ensure __str__ is formatted correctly."""
        expected_str = f"Msg {self.ticket_message.id} on Ticket {self.ticket_message.ticket_id}"
        self.assertEqual(str(self.ticket_message), expected_str)

    def test_valid_ticket_message_is_valid(self):
        """Check that a default valid TicketMessage passes validation."""
        try:
            self.ticket_message.full_clean()
        except ValidationError:
            self.fail("Default test TicketMessage should be valid.")

    def test_ticket_message_no_sender_profile_raises_error(self):
        """sender_profile cannot be None."""
        self.ticket_message.sender_profile = None
        with self.assertRaises(ValidationError):
            self.ticket_message.full_clean()

    def test_ticket_message_no_message_body_raises_error(self):
        """message_body cannot be empty."""
        self.ticket_message.message_body = ''
        with self.assertRaises(ValidationError):
            self.ticket_message.full_clean()

    def test_ticket_message_no_ticket_raises_error(self):
        """ticket cannot be None."""
        self.ticket_message.ticket = None
        with self.assertRaises(ValidationError):
            self.ticket_message.full_clean()

    def test_ticket_message_is_internal_default(self):
        """Check default of is_internal is False."""
        msg = TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.user1,
            message_body="New message"
        )
        self.assertFalse(msg.is_internal, "Default is_internal should be False.")

    def test_ticket_message_is_internal_true_is_valid(self):
        """Check is_internal can be set to True."""
        self.ticket_message.is_internal = True
        try:
            self.ticket_message.full_clean()
        except ValidationError:
            self.fail("TicketMessage with is_internal=True should be valid.")

    def test_ticket_message_is_internal_false_is_valid(self):
        """Check is_internal can be set to False."""
        self.ticket_message.is_internal = False
        try:
            self.ticket_message.full_clean()
        except ValidationError:
            self.fail("TicketMessage with is_internal=False should be valid.")

    def test_ticket_message_created_at_auto_now_add(self):
        """
        created_at is auto_now_add=True, so it should set automatically
        and not change on subsequent saves.
        """
        original_created_at = self.ticket_message.created_at
        # Sleep to ensure at least 1 second difference if it were to change
        sleep(1)
        self.ticket_message.message_body = "Updated message"
        self.ticket_message.save()
        self.ticket_message.refresh_from_db()

        # created_at should NOT change after the first assignment
        self.assertEqual(original_created_at, self.ticket_message.created_at)

    def test_ticket_message_multiple_saves(self):
        """Ensure multiple saves do not change created_at."""
        msg = TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.user2,
            message_body="Another new message"
        )
        first_created_at = msg.created_at
        sleep(1)
        msg.message_body = "Updated body"
        msg.save()
        msg.refresh_from_db()
        self.assertEqual(first_created_at, msg.created_at)

    def test_ticket_message_can_be_internal_and_updated(self):
        """Test updating is_internal after creation."""
        msg = TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.user1,
            message_body="Internal message",
            is_internal=False
        )
        # Update is_internal to True
        msg.is_internal = True
        msg.save()
        msg.refresh_from_db()
        self.assertTrue(msg.is_internal, "is_internal should update to True successfully.")
