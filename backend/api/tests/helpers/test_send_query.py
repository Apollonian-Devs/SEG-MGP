

from django.test import TestCase
from unittest.mock import patch
from django.contrib.auth.models import User
from api.models import Ticket, User, Department, Officer, TicketRedirect, TicketMessage, Notification, Department
from api.serializers import TicketSerializer, UserSerializer, DepartmentSerializer, OfficerSerializer, TicketRedirectSerializer, TicketMessageSerializer, NotificationSerializer, ChangeTicketDateSerializer
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from api.helpers import send_query


'''
def send_query(student_user, subject, description, message_body, attachments=None):
    """
    Creates a new ticket for 'student' user.
    Also creates an initial TicketMessage and handles file attachments.
    """

    if student_user is None or student_user.is_staff or student_user.is_superuser:
        raise PermissionDenied("Only student users can create tickets.")

    ticket = Ticket(
        subject=subject,
        description=description,
        created_by=student_user,  
        status="Open", 
        priority=None,  
        due_date=None,   
    )
    ticket.save()

    msg = TicketMessage.objects.create(
        ticket=ticket,
        sender_profile=student_user,
        message_body=message_body,
        is_internal=False
    )

    if attachments:
        for att in attachments:
            if "file_name" in att and "file_path" in att:
                TicketAttachment.objects.create(
                    message=msg,
                    file_name=att["file_name"],
                    file_path=att["file_path"],
                    mime_type=att.get("mime_type", "application/octet-stream"),
                )

    TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=None,
        new_status="Open",
        changed_by_profile=student_user,
        notes="Ticket created by student."
    )

    return ticket


'''

class TestSendQuery(TestCase):
    def setUp(self):
        self.student_user = User.objects.create_user(username="student", email="username@gmail.com", password="password")
        self.department = Department.objects.get_or_create(name="IT")
        self.officer_user = User.objects.create_user(username="officer", email="officer@gmail.com", password="password")
        self.officer = Officer.objects.create(user=self.officer_user, department=self.department)
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
    
    @patch("api.helpers.send_query")
    def test_send_query(self, mock_send_query):
        mock_send_query.return_value = Ticket.objects.create(
            subject=self.subject,
            description=self.description,
            created_by=self.student_user,
            status="Open",
            priority=None,
            due_date=None
        )

        ticket = send_query(self.student_user, self.subject, self.description, self.message_body, self.attachments)
        self.assertEqual(ticket.created_by, self.student_user)
        self.assertEqual(ticket.subject, self.subject)
        self.assertEqual(ticket.description, self.description)
        self.assertEqual(ticket.status, "Open")
        self.assertEqual(ticket.priority, None)
        self.assertEqual(ticket.due_date, None)

        mock_send_query.assert_called_once_with(self.student_user, self.subject, self.description, self.message_body, self.attachments)

