

from django.test import TestCase
from unittest.mock import patch
from django.contrib.auth.models import User
from api.models import Ticket, User, Department, Officer, TicketRedirect, TicketMessage, Notification, Department
from api.serializers import TicketSerializer, UserSerializer, DepartmentSerializer, OfficerSerializer, TicketRedirectSerializer, TicketMessageSerializer, NotificationSerializer, ChangeTicketDateSerializer
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from api.helpers import send_query

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


    '''
    raise permission denied if student_user is None 
    '''
    def test_send_query_student_user_is_none(self):
        with self.assertRaises(PermissionDenied):
            send_query(None, self.subject, self.description, self.message_body, self.attachments)

    '''
    raise permission denied if student_user.is_staff
    '''

    def test_send_query_student_user_is_staff(self):
        self.student_user.is_staff = True
        with self.assertRaises(PermissionDenied):
            send_query(self.student_user, self.subject, self.description, self.message_body, self.attachments)
    '''
    raise permission denied if student_user.is_superuser
    '''
    def test_send_query_student_user_is_superuser(self):
        self.student_user.is_superuser = True
        with self.assertRaises(PermissionDenied):
            send_query(self.student_user, self.subject, self.description, self.message_body, self.attachments)

    #(student_user, subject, description, message_body, attachments=None)
    '''
    test if ticket is created when subject is not provided 
    '''

    def test_send_query_subject_is_none(self):
        with self.assertRaises(ValueError):
            send_query(self.student_user, None, self.description, self.message_body, self.attachments)

    '''
    test if ticket is created when decscription is not provided
    '''

    def test_send_query_description_is_none(self):
        with self.assertRaises(ValueError):
            send_query(self.student_user, self.subject, None, self.message_body, self.attachments)

    '''
    test if ticket is created when message_body is not provided
    '''

    def test_send_query_message_body_is_none(self):
        with self.assertRaises(ValueError):
            send_query(self.student_user, self.subject, self.description, None
            , self.attachments)
    '''
    test if ticket is created when attachments is not provided
    '''

    def test_send_query_attachments_is_none(self):
        ticket = send_query(self.student_user, self.subject, self.description, self.message_body)
        self.assertEqual(ticket.created_by, self.student_user)
        self.assertEqual(ticket.subject, self.subject)
        self.assertEqual(ticket.description, self.description)
        self.assertEqual(ticket.status, "Open")
        self.assertEqual(ticket.priority, None)
        self.assertEqual(ticket.due_date, None)

    '''
    test if ticket is created when student_user, subject, description, message_body, attachments are provided
    '''
    def test_send_query_all_parameters_provided(self):
        ticket = send_query(self.student_user, self.subject, self.description, self.message_body, self.attachments)
        self.assertEqual(ticket.created_by, self.student_user)
        self.assertEqual(ticket.subject, self.subject)
        self.assertEqual(ticket.description, self.description)
        self.assertEqual(ticket.status, "Open")
        self.assertEqual(ticket.priority, None)
        self.assertEqual(ticket.due_date, None)
        self.assertEqual(ticket.ticketmessage_set.first().message_body, self.message_body)
        self.assertEqual(ticket.ticketattachment_set.first().file_name, "test.txt")
        self.assertEqual(ticket.ticketattachment_set.first().file_path, "/path/to/test.txt")
        self.assertEqual(ticket.ticketattachment_set.first().mime_type, "text/plain")
        self.assertEqual(ticket.ticketstatushistory_set.first().old_status, None)
        self.assertEqual(ticket.ticketstatushistory_set.first().new_status, "Open")
        self.assertEqual(ticket.ticketstatushistory_set.first().changed_by_profile, self.student_user)

    