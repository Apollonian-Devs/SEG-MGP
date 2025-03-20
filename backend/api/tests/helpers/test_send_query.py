from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from api.models import TicketStatusHistory
from api.helpers import send_query

class TestSendQuery(TestCase):
    def setUp(self):
        self.student_user = User.objects.create_user(username="student", email="student@example.com", password="password")
        self.subject = "Test Subject"
        self.description = "Test Description"
        self.message_body = "Test Message Body"
        self.attachments = [
            {
                "file_name": "test.txt",
                "file_path": "/path/to/test.txt",
                "mime_type": "text/plain"
            }
        ]

    def test_send_query_success(self):
        """
        Test that a ticket is created successfully for a valid student.
        """
        ticket = send_query(self.student_user, self.subject, self.description, self.message_body, self.attachments)
        self.assertEqual(ticket.created_by, self.student_user)
        self.assertEqual(ticket.subject, self.subject)
        self.assertEqual(ticket.description, self.description)
        self.assertEqual(ticket.status, "Open")
        self.assertIsNone(ticket.priority)
        self.assertIsNone(ticket.due_date)

        self.assertEqual(ticket.ticketmessage_set.count(), 1)
        self.assertEqual(ticket.ticketmessage_set.first().message_body, self.message_body)

  
        self.assertEqual(ticket.ticketmessage_set.first().ticketattachment_set.count(), 1)
        attachment = ticket.ticketmessage_set.first().ticketattachment_set.first()
        self.assertEqual(attachment.file_name, "test.txt")
        self.assertEqual(attachment.file_path, "/path/to/test.txt")
        self.assertEqual(attachment.mime_type, "text/plain")


        status_history = TicketStatusHistory.objects.get(ticket=ticket)
        self.assertIsNone(status_history.old_status)
        self.assertEqual(status_history.new_status, "Open")
        self.assertEqual(status_history.changed_by_profile, self.student_user)
        self.assertEqual(status_history.notes, "Ticket created by student.")

    def test_send_query_no_attachments(self):
        """
        Test that a ticket is created without attachments.
        """
        ticket = send_query(self.student_user, self.subject, self.description, self.message_body)
        self.assertEqual(ticket.ticketmessage_set.first().ticketattachment_set.count(), 0)

    def test_send_query_raises_permission_denied_for_staff(self):
        """
        Test that a staff member cannot create a ticket.
        """
        staff_user = User.objects.create_user(username="staff", email="staff@example.com", password="password", is_staff=True)
        with self.assertRaises(PermissionDenied):
            send_query(staff_user, self.subject, self.description, self.message_body, self.attachments)

    def test_send_query_raises_permission_denied_for_superuser(self):
        """
        Test that a superuser cannot create a ticket.
        """
        admin_user = User.objects.create_superuser(username="admin", email="admin@example.com", password="password")
        with self.assertRaises(PermissionDenied):
            send_query(admin_user, self.subject, self.description, self.message_body, self.attachments)

    def test_send_query_raises_value_error_if_subject_is_missing(self):
        """
        Test that a ValueError is raised if the subject is missing.
        """
        with self.assertRaises(ValueError) as context:
            send_query(self.student_user, None, self.description, self.message_body, self.attachments)
        self.assertEqual(str(context.exception), "Subject is required")

    def test_send_query_raises_value_error_if_description_is_missing(self):
        """
        Test that a ValueError is raised if the description is missing.
        """
        with self.assertRaises(ValueError) as context:
            send_query(self.student_user, self.subject, None, self.message_body, self.attachments)
        self.assertEqual(str(context.exception), "Description is required")

    def test_send_query_raises_value_error_if_message_body_is_missing(self):
        """
        Test that a ValueError is raised if the message body is missing.
        """
        with self.assertRaises(ValueError) as context:
            send_query(self.student_user, self.subject, self.description, None, self.attachments)
        self.assertEqual(str(context.exception), "Message body is required")

