from django.test import TestCase
from django.db import IntegrityError
from django.contrib.auth.models import User
from api.models import Notification, Ticket

class NotificationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser")
        self.ticket = Ticket.objects.create(
            subject="Test Ticket",
            description="Test",
            created_by=self.user,
            assigned_to=self.user
        )

    def test_notification_with_ticket(self):
        notification = Notification.objects.create(
            user_profile=self.user,
            ticket=self.ticket,
            message="New notification"
        )
        self.assertEqual(notification.user_profile, self.user)
        self.assertEqual(notification.ticket, self.ticket)
        self.assertEqual(notification.message, "New notification")
        self.assertFalse(notification.read_status)
        self.assertEqual(
            str(notification),
            f"Notification #{notification.id} for testuser"
        )
        self.assertIsNotNone(notification.created_at)

    def test_notification_without_ticket(self):
        notification = Notification.objects.create(
            user_profile=self.user,
            message="Another notification"
        )
        self.assertIsNone(notification.ticket)
        self.assertFalse(notification.read_status)
