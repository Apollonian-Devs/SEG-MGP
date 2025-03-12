from django.test import TestCase
from django.db import IntegrityError
from django.contrib.auth.models import User
from api.models import TicketMessage, TicketAttachment, Ticket

class TicketAttachmentTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user")
        self.ticket = Ticket.objects.create(
            subject="Test",
            description="Test",
            created_by=self.user,
            assigned_to=self.user
        )
        self.message = TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.user,
            message_body="Test message"
        )

    def test_create_attachment(self):
        attachment = TicketAttachment.objects.create(
            message=self.message,
            file_name="test.txt",
            file_path="/files/test.txt",
            mime_type="text/plain"
        )
        self.assertEqual(attachment.message, self.message)
        self.assertEqual(attachment.file_name, "test.txt")
        self.assertEqual(attachment.file_path, "/files/test.txt")
        self.assertEqual(attachment.mime_type, "text/plain")
        self.assertIsNotNone(attachment.uploaded_at)
        self.assertEqual(
            str(attachment),
            f"Attachment #{attachment.id} on Msg {self.message.id}"
        )