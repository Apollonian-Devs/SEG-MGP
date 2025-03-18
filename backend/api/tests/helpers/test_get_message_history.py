'''
def get_message_history(ticket):
    """
    Return a list of all messages for a given ticket sorted by creation date ascending.
    Only include messages where is_internal is False.
    """
    messages = TicketMessage.objects.filter(ticket=ticket, is_internal=False).order_by("created_at")

    msg_list = []
    for m in messages:
        # Determine the sender role
        if not m.sender_profile.is_staff:
            sender_role = "Student"
        elif m.sender_profile.is_superuser:
            sender_role = "Admin"
        else:
            sender_role = "Officer"
        
        msg_list.append({
            "message_id": m.id,
            "sender": m.sender_profile.username,
            "sender_role": sender_role,
            "body": m.message_body,
            "created_at": m.created_at,
        })
    return msg_list
'''
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import Ticket, TicketMessage
from api.helpers import get_message_history

class TestGetMessageHistory(TestCase):

    def setUp(self):
        """Set up users and a ticket for testing"""
        self.student = User.objects.create_user(username="student", email="student@gmail.com", password="password")
        self.officer = User.objects.create_user(username="officer", email="officer@gmail.com", password="password", is_staff=True)
        self.admin = User.objects.create_user(username="admin", email="admin@gmail.com", password="password", is_superuser=True)

        self.ticket = Ticket.objects.create(
            subject="Test Ticket",
            description="Test Description",
            created_by=self.student,
            assigned_to=self.officer,
            status="Open",
            priority="Medium",
            due_date=timezone.now() + timezone.timedelta(days=3)
        )


    def test_ticket_is_none(self):
        """Test passing None instead of a ticket"""
        with self.assertRaises(ValueError):
            get_message_history(None)

    def test_with_invalid_ticket_passed(self):
        """Test with a ticket that does not exist"""
        fake_ticket = Ticket(id=999) 
        messages = get_message_history(fake_ticket)
        
        self.assertEqual(messages, [])

    def test_ticket_with_one_message(self):
        """Test retrieving history for a ticket with a single message"""
        TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.student,
            message_body="First Message",
            created_at=timezone.now(),
            is_internal=False
        )

        history = get_message_history(self.ticket)
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]["body"], "First Message")

    def test_ticket_with_multiple_messages(self):
        """Test retrieving multiple messages sorted by creation date"""
        TicketMessage.objects.create(
            ticket=self.ticket, sender_profile=self.student, message_body="First", created_at=timezone.now(), is_internal=False
        )
        TicketMessage.objects.create(
            ticket=self.ticket, sender_profile=self.officer, message_body="Second", created_at=timezone.now() + timezone.timedelta(minutes=1), is_internal=False
        )
        TicketMessage.objects.create(
            ticket=self.ticket, sender_profile=self.admin, message_body="Third", created_at=timezone.now() + timezone.timedelta(minutes=2), is_internal=False
        )

        history = get_message_history(self.ticket)
        self.assertEqual(len(history), 3)
        self.assertEqual(history[0]["body"], "First")
        self.assertEqual(history[1]["body"], "Second")
        self.assertEqual(history[2]["body"], "Third")

    def test_sender_role_when_neither_staff_nor_superuser(self):
        """Test sender role detection for a student"""
        TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.student,
            message_body="Student message",
            created_at=timezone.now(),
            is_internal=False
        )

        history = get_message_history(self.ticket)
        self.assertEqual(history[0]["sender_role"], "Student")

    def test_sender_role_when_only_is_staff(self):
        """Test sender role detection for an officer (staff but not superuser)"""
        TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.officer,
            message_body="Officer message",
            created_at=timezone.now(),
            is_internal=False
        )

        history = get_message_history(self.ticket)
        self.assertEqual(history[0]["sender_role"], "Officer")

    def test_sender_role_when_is_super_user(self):
        """Test sender role detection for an admin (superuser)"""
        TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.admin,
            message_body="Admin message",
            created_at=timezone.now(),
            is_internal=False
        )

        history = get_message_history(self.ticket)
        self.assertEqual(history[0]["sender_role"], "Admin")

    def test_message_list_was_formatted_correctly(self):
        """Test message list structure"""
        msg = TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.student,
            message_body="Check formatting",
            created_at=timezone.now(),
            is_internal=False
        )

        history = get_message_history(self.ticket)
        expected_message = {
            "message_id": msg.id,
            "sender": self.student.username,
            "sender_role": "Student",
            "body": "Check formatting",
            "created_at": msg.created_at,
        }

        self.assertEqual(history[0], expected_message)
