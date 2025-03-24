from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, ValidationError
from api.models import Ticket, TicketStatusHistory, Notification, TicketAttachment
from api.helpers import send_response
from unittest.mock import patch, MagicMock


class TestSendResponse(TestCase):
    def setUp(self):
        self.student_user = User.objects.create_user(username="student", email="student@gmail.com", password="password")
        self.staff_user = User.objects.create_user(username="staff", email="staff@gmail.com", password="password", is_staff=True)

    def test_send_response_sender_profile_is_none(self):
        with self.assertRaises(PermissionDenied):
            send_response(None, None, "Test Message Body")

    def test_send_response_ticket_is_none(self):
        with self.assertRaises(ValidationError):
            send_response(self.student_user, None, "Test Message Body")

    def test_send_response_ticket_status_is_closed(self):
        ticket = Ticket.objects.create(created_by=self.student_user, subject="Test", description="Desc", status="Closed")
        with self.assertRaises(ValidationError):
            send_response(self.student_user, ticket, "Test Message Body")

    def test_send_response_attachments_provided(self):
        ticket = Ticket.objects.create(created_by=self.student_user, subject="Test", description="Desc", status="Open")
        attachments = [{"file_name": "test.txt", "file_path": "/path/to/test.txt", "mime_type": "text/plain"}]

        message = send_response(self.student_user, ticket, "Test Message Body", attachments=attachments)

        self.assertEqual(message.ticket, ticket)
        self.assertEqual(message.sender_profile, self.student_user)
        self.assertEqual(message.message_body, "Test Message Body")
        self.assertFalse(message.is_internal)
        self.assertEqual(TicketAttachment.objects.count(), 1)

        attachment = TicketAttachment.objects.first()
        self.assertEqual(attachment.file_name, "test.txt")
        self.assertEqual(attachment.file_path, "/path/to/test.txt")
        self.assertEqual(attachment.mime_type, "text/plain")

    def test_send_response_attachments_not_provided(self):
        ticket = Ticket.objects.create(created_by=self.student_user, subject="Test", description="Desc", status="Open")
        message = send_response(self.student_user, ticket, "Test Message Body")

        self.assertEqual(TicketAttachment.objects.count(), 0)

    def test_send_response_ticket_status_not_equal_to_expected_status(self):
        ticket = Ticket.objects.create(created_by=self.student_user, subject="Test", description="Desc", status="Open")

        send_response(self.staff_user, ticket, "Test Message Body")

        ticket.refresh_from_db()  
        self.assertEqual(ticket.status, "Awaiting Student")

        status_history = TicketStatusHistory.objects.get(ticket=ticket)
        self.assertEqual(status_history.old_status, "Open")
        self.assertEqual(status_history.new_status, "Awaiting Student")
        self.assertEqual(status_history.changed_by_profile, self.staff_user)

    def test_send_response_ticket_status_equal_to_expected_status(self):
        ticket = Ticket.objects.create(created_by=self.student_user, subject="Test", description="Desc", status="Awaiting Student")

        send_response(self.staff_user, ticket, "Test Message Body")

        ticket.refresh_from_db()
        self.assertEqual(ticket.status, "Awaiting Student")


        self.assertFalse(TicketStatusHistory.objects.filter(ticket=ticket, old_status="Awaiting Student").exists())

    #@patch("api.helpers.yagmail.SMTP")
    @patch("api.helpers.notification_helpers.yagmail.SMTP")
    def test_send_response_create_notification_for_staff(self, mock_yagmail):
        """ Test email sending for staff responses. """
        ticket = Ticket.objects.create(
            created_by=self.student_user, subject="Test Subject", description="Test Description", status="Open"
        )

        mock_smtp_instance = MagicMock()
        mock_yagmail.return_value = mock_smtp_instance 

        send_response(self.staff_user, ticket, "Test Message Body")

 
        self.assertEqual(Notification.objects.count(), 1)

    
        mock_smtp_instance.send.assert_called_once_with(
            to=self.student_user.email,
            subject="Message Recieved",
            contents=f"Staff replied to Ticket #{ticket.id}",
        )

    #@patch("api.helpers.yagmail.SMTP")
    @patch("api.helpers.notification_helpers.yagmail.SMTP")
    def test_send_response_create_notification_for_assigned_to(self, mock_yagmail):
        """ Test email sending for student responses to assigned staff. """
        ticket = Ticket.objects.create(
            created_by=self.student_user,
            assigned_to=self.staff_user, 
            subject="Test Subject",
            description="Test Description",
            status="Open"
        )

        mock_smtp_instance = MagicMock()
        mock_yagmail.return_value = mock_smtp_instance  

        send_response(self.student_user, ticket, "Test Message Body")


        self.assertEqual(Notification.objects.count(), 1)


        mock_smtp_instance.send.assert_called_once_with(
            to=self.staff_user.email,
            subject="Message Recieved",
            contents=f"Student replied to Ticket #{ticket.id}",
        )







        
