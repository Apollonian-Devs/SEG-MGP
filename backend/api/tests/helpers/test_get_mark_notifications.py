from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from api.models import Notification, Ticket
from api.helpers import get_notifications, mark_id_as_read, mark_all_notifications_as_read

'''
class Notification(models.Model):
     user_profile = models.ForeignKey(User, on_delete=models.CASCADE)
     ticket= models.ForeignKey(Ticket, on_delete=models.CASCADE, null=True, blank=True)
     message = models.CharField(max_length=255)
     created_at = models.DateTimeField(auto_now_add=True)   
     read_status = models.BooleanField(default=False)
'''


class NotificationTests(TestCase):
    def setUp(self):
        """
        Setup users and notifications for testing.
        """
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.other_user = User.objects.create_user(username="otheruser", password="password456")

        # Create sample tickets
        self.ticket1 = Ticket.objects.create(subject="Test Ticket", description="Testing", created_by=self.user)
        
        # Create multiple notifications (some unread, some read)
        self.notification1 = Notification.objects.create(
            user_profile=self.user,
            ticket=self.ticket1,
            message="New ticket assigned",
            created_at=timezone.now(),
            read_status=False,
        )
        
        self.notification2 = Notification.objects.create(
            user_profile=self.user,
            ticket=self.ticket1,
            message="Ticket updated",
            created_at=timezone.now(),
            read_status=False,
        )

        self.notification3 = Notification.objects.create(
            user_profile=self.user,
            ticket=self.ticket1,
            message="Another update",
            created_at=timezone.now(),
            read_status=True,  # Already read
        )

        self.notification_other_user = Notification.objects.create(
            user_profile=self.other_user,
            ticket=self.ticket1,
            message="Other user's notification",
            created_at=timezone.now(),
            read_status=False,
        )

    def test_get_notifications_with_unread_notifications(self):
        """
        Test retrieving unread notifications.
        """
        notifications = get_notifications(self.user, limit=10)
        self.assertEqual(len(notifications), 2)
        self.assertIn(self.notification1, notifications)
        self.assertIn(self.notification2, notifications)
        self.assertNotIn(self.notification3, notifications)  
        self.assertNotIn(self.notification_other_user, notifications) 

    def test_get_notifications_with_no_unread_notifications(self):
        """
        Test retrieving notifications when all are read.
        """
        self.notification1.read_status = True
        self.notification2.read_status = True
        self.notification1.save()
        self.notification2.save()

        notifications = get_notifications(self.user)
        self.assertEqual(len(notifications), 0)  

    def test_get_notifications_respects_limit(self):
        """
        Test that the limit parameter correctly limits results.
        """
        notifications = get_notifications(self.user, limit=1)
        self.assertEqual(len(notifications), 1)

    def test_mark_id_as_read_valid_notification(self):
        """
        Test marking a specific notification as read.
        """
        self.assertFalse(self.notification1.read_status) 
        mark_id_as_read(self.notification1.id)
        self.notification1.refresh_from_db()
        self.assertTrue(self.notification1.read_status) 

    def test_mark_id_as_read_invalid_notification(self):
        """
        Test marking a nonexistent notification ID (should do nothing).
        """
        non_existent_id = 99999
        mark_id_as_read(non_existent_id)  
        self.notification1.refresh_from_db()
        self.assertFalse(self.notification1.read_status)  

    def test_mark_all_notifications_as_read(self):
        """
        Test marking all unread notifications as read for a user.
        """
        mark_all_notifications_as_read(self.user)

        self.notification1.refresh_from_db()
        self.notification2.refresh_from_db()
        self.notification3.refresh_from_db()
        self.notification_other_user.refresh_from_db()

        self.assertTrue(self.notification1.read_status)
        self.assertTrue(self.notification2.read_status)
        self.assertTrue(self.notification3.read_status) 
        self.assertFalse(self.notification_other_user.read_status) 

    