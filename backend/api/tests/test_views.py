from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Ticket, Department, Officer, TicketMessage, TicketAttachment, TicketRedirect, Notification
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import datetime
from rest_framework import status
from django.utils.timezone import make_aware
from unittest.mock import patch


### TEST TICKETLISTCREATE VIEW HERE ###
class TestTicketListCreateView(TestCase):
    def setUp(self):
        self.client = APIClient()


    def authorize_student(self):
        test_student = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last"
        }
        
        self.client.post(reverse("register"), test_student)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.create_ticket(test_student)

    def create_ticket(self, student_data):
        created_by, _ = User.objects.get_or_create(username=student_data["username"], defaults=student_data)

        ticket = Ticket.objects.create(
            subject="Test ticket 1",
            description="This is a test ticket",
            created_by=created_by
        )

        return ticket

    def authorize_staff(self):
        test_staff = {
            "username": "@testStaff",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
        }
        
        self.client.post(reverse("register"), test_staff)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStaff", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

    
    def test_post_request_succeeds_and_creates_ticket_with_valid_data(self):
        self.authorize_student()
        
        valid_data = {
            'subject': 'Test ticket 2',
            'description': 'This is a test ticket',
            'message': 'Test message',
            'attachments': ''
        }

        self.assertEqual(Ticket.objects.count(), 1)

        response = self.client.post(reverse("ticket-list"), valid_data)

        self.assertEqual(response.status_code, 201)

        self.assertEqual(Ticket.objects.count(), 2)
        self.assertEqual(Ticket.objects.all()[1].subject, 'Test ticket 2')
        self.assertEqual(Ticket.objects.all()[1].description, 'This is a test ticket')
    

    def test_post_request_fails_with_staff_user(self):
        self.authorize_staff()

        valid_data = {
            'subject': 'Test ticket 2',
            'description': 'This is a test ticket',
            'message': 'Test message',
            'attachments': ''
        }

        response = self.client.post(reverse("ticket-list"), valid_data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "An error has occurred")



    def test_get_request_succeeds_with_valid_user(self):
        self.authorize_student()
        
        response = self.client.get(reverse("ticket-list"))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(Ticket.objects.count(), 1)

        self.assertEqual(response.data[0]['id'], 1)
        self.assertEqual(response.data[0]['subject'], "Test ticket 1")
        self.assertEqual(response.data[0]['description'], "This is a test ticket")



#### TEST TICKETCHANGESTATUS VIEW HERE ####
class TestTicketChangeStatusView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="student1", password="testpass")

        self.ticket = Ticket.objects.create(
            subject="Test ticket 1",
            description="This is a test ticket",
            created_by=self.student_user,
        )

    def authorize_student(self):
        test_student = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
                    }
        
        self.client.post(reverse("register"), test_student)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def authorize_staff(self):
        test_staff = {
            "username": "@testStaff",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
                    }
        
        self.client.post(reverse("register"), test_staff)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStaff", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def get_request_helper(self, responseInstance):
        self.assertEqual(responseInstance.status_code, 200)
        self.assertEqual(responseInstance.data["message"], "Status changed")

        self.ticket.refresh_from_db()


    def test_get_request_succeeds_and_updates_ticket_status_with_staff_member_and_valid_data(self):
        self.authorize_staff()

        self.assertEqual(self.ticket.status, "Open") # Default ticket status is "Open"

        response = self.client.get(reverse("change-status", kwargs={'id': 1}))

        self.get_request_helper(response)

        self.assertEqual(self.ticket.status, "In Progress") # Status has been updated to "In Progress"


    def test_multiple_get_requests_succeed_and_loop_back_to_original_status(self):
        self.authorize_staff()

        self.assertEqual(self.ticket.status, "Open") # Default ticket status is "Open"

        response = self.client.get(reverse("change-status", kwargs={'id': 1}))
        
        self.get_request_helper(response)

        self.assertEqual(self.ticket.status, "In Progress") # Status has been rotated to "In Progress"

        secondResponse = self.client.get(reverse("change-status", kwargs={'id': 1}))
        
        self.get_request_helper(secondResponse)

        self.assertEqual(self.ticket.status, "Awaiting Student") # Status has been rotated to "Awaiting Student"

        thirdResponse = self.client.get(reverse("change-status", kwargs={'id': 1}))

        self.get_request_helper(thirdResponse)

        self.assertEqual(self.ticket.status, "Closed") # Status has been rotated to "Closed"

        fourthResponse = self.client.get(reverse("change-status", kwargs={'id': 1}))

        self.get_request_helper(fourthResponse)

        self.assertEqual(self.ticket.status, "Open") # Status should have been rotated back to "Open"


    def test_get_request_fails_with_invalid_ticket(self):
        self.authorize_staff()

        response = self.client.get(reverse("change-status", kwargs={'id': 2}))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "Ticket not found")


    def test_get_request_fails_with_permission_denied_when_a_student_makes_a_request(self):
        self.authorize_student()

        response = self.client.get(reverse("change-status", kwargs={'id': 1}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["error"], "Permission denied")


    @patch('api.views.changeTicketStatus')
    def test_get_request_fails_when_changeTicketStatus_raises_an_exception(self, mock_changeTicketStatus):
        self.authorize_staff()
        
        mock_changeTicketStatus.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("change-status", kwargs={'id': 1}))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST TICKETCHANGEPRIORITY VIEW HERE ####
class TestTicketChangePriorityView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="student1", password="testpass")

        self.ticket = Ticket.objects.create(
            subject="Test ticket 1",
            description="This is a test ticket",
            created_by=self.student_user,
        )

    def authorize_student(self):
        test_student = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
                    }
        
        self.client.post(reverse("register"), test_student)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def authorize_staff(self):
        test_staff = {
            "username": "@testStaff",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
                    }
        
        self.client.post(reverse("register"), test_staff)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStaff", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def get_request_helper(self, responseInstance):
        self.assertEqual(responseInstance.status_code, 200)
        self.assertEqual(responseInstance.data["message"], "Priority changed")

        self.ticket.refresh_from_db()


    def test_get_request_succeeds_and_updates_ticket_priority_with_staff_member_and_valid_data(self):
        self.authorize_staff()

        self.assertEqual(self.ticket.priority, None) # Default ticket priority is None

        response = self.client.get(reverse("change-priority", kwargs={'id': 1}))

        self.get_request_helper(response)

        self.assertEqual(self.ticket.priority, "Low") # Priority has been updated to "Low"


    def test_multiple_get_requests_succeed_and_loop_back_to_original_priority(self):
        self.authorize_staff()

        self.assertEqual(self.ticket.priority, None) # Default ticket priority is None

        response = self.client.get(reverse("change-priority", kwargs={'id': 1}))
        
        self.get_request_helper(response)

        self.assertEqual(self.ticket.priority, "Low") # Priority has been rotated to "Low"

        secondResponse = self.client.get(reverse("change-priority", kwargs={'id': 1}))
        
        self.get_request_helper(secondResponse)

        self.assertEqual(self.ticket.priority, "Medium") # Priority has been rotated to "Medium"

        thirdResponse = self.client.get(reverse("change-priority", kwargs={'id': 1}))

        self.get_request_helper(thirdResponse)

        self.assertEqual(self.ticket.priority, "High") # Priority has been rotated to "High"

        fourthResponse = self.client.get(reverse("change-priority", kwargs={'id': 1}))

        self.get_request_helper(fourthResponse)

        self.assertEqual(self.ticket.priority, "Low") # Priority should have been rotated back to "Low"


    def test_get_request_fails_with_invalid_ticket(self):
        self.authorize_staff()

        response = self.client.get(reverse("change-priority", kwargs={'id': 2}))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "Ticket not found")


    def test_get_request_fails_with_permission_denied_when_a_student_makes_a_request(self):
        self.authorize_student()

        response = self.client.get(reverse("change-priority", kwargs={'id': 1}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["error"], "Permission denied")


    @patch('api.views.changeTicketPriority')
    def test_get_request_fails_when_changeTicketPriority_raises_an_exception(self, mock_changeTicketPriority):
        self.authorize_staff()
       
        mock_changeTicketPriority.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("change-priority", kwargs={'id': 1}))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST TICKETDELETE VIEW HERE ####
class TestTicketDeleteView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.client.force_authenticate(user=self.student_user)
        
        Ticket.objects.create(id=1,
                              subject="A test ticket",
                              description="This is a test ticket",
                              created_by=self.student_user)
        Ticket.objects.create(id=2,
                              subject="Another test ticket",
                              description="This is another test ticket",
                              created_by=self.student_user)
        
        self.different_student = User.objects.create_user(username="differentStudent", password="testpass")
        Ticket.objects.create(id=3,
                              subject="A random ticket",
                              description="This is a random ticket",
                              created_by=self.different_student)


    def test_get_request_succeeds_with_valid_user_and_pk_deletes_the_ticket_with_the_given_pk(self):
        self.assertEqual(Ticket.objects.count(), 3)

        response = self.client.delete(reverse("delete-ticket", kwargs={"pk": 1}))

        self.assertEqual(response.status_code, 204)

        self.assertEqual(Ticket.objects.count(), 2)


    def test_get_request_fails_with_invalid_pk(self):
        self.assertEqual(Ticket.objects.count(), 3)

        response = self.client.delete(reverse("delete-ticket", kwargs={"pk": 4}))

        self.assertEqual(response.status_code, 404)

        self.assertEqual(Ticket.objects.count(), 3)


    def test_get_request_fails_when_trying_to_delete_a_ticket_created_by_another_student(self):
        self.assertEqual(Ticket.objects.count(), 3)

        response = self.client.delete(reverse("delete-ticket", kwargs={"pk": 3}))

        self.assertEqual(response.status_code, 404)

        self.assertEqual(Ticket.objects.count(), 3)



#### TEST CURRENTUSER VIEW HERE ####
class TestCurrentUserView(TestCase):
    def setUp(self):
        self.client = APIClient()

    def authorize_student(self):
        test_user = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last"
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

    def authorize_staff(self):
        test_user = {
            "username": "@testStaff",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStaff", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

    
    def test_get_returns_a_serialized_student_when_the_requesting_user_is_a_student(self):
        self.authorize_student()

        response = self.client.get(reverse("current-user"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "@testStudent")
        self.assertEqual(response.data["is_staff"], False)


    def test_get_returns_a_serialized_staff_member_when_the_requesting_user_is_staff(self):
        self.authorize_staff()

        response = self.client.get(reverse("current-user"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "@testStaff")
        self.assertEqual(response.data["is_staff"], True)


    @patch("api.serializers.UserSerializer.to_representation")
    def test_get_request_fails_when_serialized_user_is_invalid_and_throws_an_exception(self, mock_data):
        self.authorize_staff()

        mock_data.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("current-user"))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST USERTICKETS VIEW HERE ####
class TestUserTicketsView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.random_student = User.objects.create(username="randomStudent", password="testpass")
        self.random_ticket = Ticket.objects.create(id=10,
                                                   subject="A random ticket",
                                                   description="This is a ticket not assigned to or created by anyone important",
                                                   created_by=self.random_student)
        
    def authorize_student(self):
        test_user = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last"
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.create_tickets_for_student(test_user)

    
    def create_tickets_for_student(self, test_user):
        
        created_by, _ = User.objects.get_or_create(username=test_user["username"], defaults=test_user)
        
        Ticket.objects.create(
            id=1,
            subject="Test ticket by an authorized student",
            description="This is a test ticket",
            created_by=created_by, 
        )

        Ticket.objects.create(
            id=2,
            subject="Another test ticket by an authorized student",
            description="This is a test ticket",
            created_by=created_by
        )
    

    def authorize_staff(self):
        test_user = {
            "username": "@testStaff",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStaff", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.create_tickets_assigned_to_staff(test_user)

    def create_tickets_assigned_to_staff(self, test_user):
        assigned_to, _ = User.objects.get_or_create(username=test_user["username"], defaults=test_user)

        Ticket.objects.create(
            id=1,
            subject="Test ticket assigned to an authorized staff",
            description="This is a test ticket",
            created_by=self.random_student,
            assigned_to=assigned_to 
        )

        Ticket.objects.create(
            id=2,
            subject="Another test ticket assigned to an authorized staff",
            description="This is a test ticket",
            created_by=self.random_student,
            assigned_to=assigned_to
        )

    def test_get_request_succeeds_with_a_student_user_and_returns_just_the_tickets_of_the_student_who_made_the_request(self):
        self.authorize_student()

        response = self.client.get(reverse("user-tickets"))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data["tickets"][0]["id"], 1)
        self.assertEqual(response.data["tickets"][0]["subject"], "Test ticket by an authorized student")

        self.assertEqual(response.data["tickets"][1]["id"], 2)
        self.assertEqual(response.data["tickets"][1]["subject"], "Another test ticket by an authorized student")

        # Shouldn't contain the random ticket as it wasn't created by the student making the request
        self.assertFalse(any(ticket["subject"] == "A random ticket" for ticket in response.data["tickets"]))
        self.assertFalse(any(ticket["description"] == "This is a ticket not assigned to or created by anyone important" for ticket in response.data["tickets"]))


    def test_get_request_succeeds_with_a_staff_member_and_returns_the_tickets_assigned_to_that_staff_member(self):
        self.authorize_staff()

        response = self.client.get(reverse("user-tickets"))

        self.assertEqual(response.status_code, 200) 

        self.assertEqual(response.data["tickets"][0]["id"], 1)
        self.assertEqual(response.data["tickets"][0]["subject"], "Test ticket assigned to an authorized staff")

        self.assertEqual(response.data["tickets"][1]["id"], 2)
        self.assertEqual(response.data["tickets"][1] ["subject"], "Another test ticket assigned to an authorized staff")


    @patch("api.views.get_tickets_for_user")
    def test_get_request_fails_when_get_tickets_for_user_raises_an_exception(self, mock_get_tickets_for_user):
        self.authorize_student()

        mock_get_tickets_for_user.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("user-tickets"))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST TICKETSENDRESPONSE VIEW HERE ####
class TestTicketSendResponseView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=self.student_user,
        )

    
    def authorize_user(self):
        test_user = {
            "id": "2",
            "username": "@testUser",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
                    }
        
        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testUser", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def test_post_request_succeeds_with_valid_message_body_and_attachments_and_creates_an_attachment_object(self):
        self.authorize_user()

        data = {"message_body": "Test message", 
                "attachments": [{"file_name": "test file",
                                "file_path": "random_file_path",
                                "mime_type": "random_mime_type"}]}

        self.assertEqual(TicketAttachment.objects.count(), 0)

        response = self.client.post(reverse("send-ticket", kwargs={"ticket_id": 1}), data, format="json")

        self.assertEqual(TicketAttachment.objects.count(), 1)

        self.assertEqual(response.status_code, 201)
        
        self.assertEqual(response.data["sender_profile"], 2)
        self.assertEqual(response.data["ticket"], 1)
        self.assertEqual(response.data["attachments"][0]["file_name"], "test file")
        self.assertEqual(response.data["attachments"][0]["file_path"], "random_file_path")
        self.assertEqual(response.data["attachments"][0]["mime_type"], "random_mime_type")

    
    def test_post_request_succeeds_with_only_message_body_and_no_attachments(self):
        self.authorize_user()

        response = self.client.post(reverse("send-ticket", kwargs={"ticket_id": 1}), {"message_body": "Test message"}, format="json")

        self.assertEqual(TicketAttachment.objects.count(), 0)

        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.data["sender_profile"], 2)
        self.assertEqual(response.data["ticket"], 1)
        self.assertEqual(response.data["attachments"], [])


    def test_post_request_fails_with_validation_error_with_closed_ticket(self):
        self.authorize_user()

        Ticket.objects.create(id=2, 
                            subject="Test ticket",
                            description="This is a test ticket",
                            created_by=self.student_user,
                            status="Closed")

        response = self.client.post(reverse("send-ticket", kwargs={"ticket_id": 2}), 
                                            {"message_body": "Test message"}, 
                                            format="json")
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "['Cannot respond to a closed ticket.']")


    def test_post_request_fails_with_empty_message_body(self):
        self.authorize_user()

        response = self.client.post(reverse("send-ticket", kwargs={"ticket_id": 1}))

        self.assertEqual(response.status_code, 400)
        self.assertIn("message_body", response.data)


    def test_post_request_fails_when_ticket_doesnt_exist(self):
        self.authorize_user()

        response = self.client.post(reverse("send-ticket", kwargs={"ticket_id": 2}))

        self.assertEqual(response.status_code, 400)


    @patch('api.views.TicketAttachment.objects.create')
    def test_post_request_fails_with_value_error_when_ticket_attachment_creation_raises_a_value_error(self, mock_create_value_error):
        self.authorize_user()

        data = {"message_body": "Test message", 
                "attachments": [{"file_name": "test file",
                                "file_path": "random_file_path",
                                "mime_type": "random_mime_type"}]}

        mock_create_value_error.side_effect = ValueError("A value error was raised")

        response = self.client.post(reverse("send-ticket", kwargs={'ticket_id': 1}), data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "A value error was raised")


    @patch('api.views.send_response')
    def test_post_request_fails_with_exception_when_send_response_raises_an_exception(self, mock_send_response):
        self.authorize_user()

        data = {"message_body": "Test message", 
                "attachments": [{"file_name": "test file",
                                "file_path": "random_file_path",
                                "mime_type": "random_mime_type"}]}

        mock_send_response.side_effect = Exception("An exception was raised")

        response = self.client.post(reverse("send-ticket", kwargs={'ticket_id': 1}), data, format="json")

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")        


#### TEST TICKETMESSAGEHISTORY VIEW HERE ####
class TestTicketMessageHistoryView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=self.student_user,
        )

    def authorize_user(self):
        test_user = {
            "username": "@testUser",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
                    }
        
        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testUser", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def test_get_request_succeeds_with_ticket_with_no_messages(self):
        self.authorize_user()

        response = self.client.get(reverse('ticket-messages', kwargs={'ticket_id': 1}))
        self.assertEqual(response.status_code, 200)
        # empty list returned in the response as there is no overdue tickets
        self.assertEqual(response.data['messages'], [])


    def test_get_request_succeeds_with_ticket_with_a_message_and_attachment(self):
        self.authorize_user()

        message = TicketMessage.objects.create(
            ticket = self.ticket,
            sender_profile = self.student_user,
            message_body = "Test message",
        )

        attachment = TicketAttachment.objects.create(
            message = message,
            file_name = "test_file.png",
            file_path = "test.path",
        )

        response = self.client.get(reverse('ticket-messages', kwargs={'ticket_id': 1}))
        self.assertEqual(response.status_code, 200)
        

        # get the details of the first and only message in the list of message dictionaries
        self.assertEqual(response.data['messages'][0]['body'], "Test message")
        self.assertEqual(response.data['messages'][0]['message_id'], 1)
        self.assertEqual(response.data['messages'][0]['sender'], 'testStudent')
        
        self.assertEqual(response.data['messages'][0]['attachments'][0]['file_name'], 'test_file.png')
        self.assertEqual(response.data['messages'][0]['attachments'][0]['file_path'], 'test.path')


    def test_get_request_fails_with_ticket_that_doesnt_exist(self):
        self.authorize_user()

        response = self.client.get(reverse('ticket-messages', kwargs={'ticket_id': 2}))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], "Ticket not found")


    @patch('api.views.get_message_history')
    def test_get_request_fails_when_get_message_history_raises_an_exception(self, mock_get_message_history):
        self.authorize_user()
       
        mock_get_message_history.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("ticket-messages", kwargs={'ticket_id': 1}))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST ALLOFFICERSVIEW VIEW HERE ####
class TestAllOfficersView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.department_1 = Department.objects.create(name="IT Support", description="Handles IT Issues")
        self.user = User.objects.create(id=1, username="Username", password="testpass", is_staff=True)
        officer_1 = Officer.objects.create(user=self.user, department=self.department_1)


    def authorize_chief_officer(self):
        test_user = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
        }
        
        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.assign_chief_officer(test_user)

    def assign_chief_officer(self, test_user):
        user, _ = User.objects.get_or_create(username=test_user["username"], defaults=test_user)

        officer = Officer.objects.create(user=user, department=self.department_1, is_department_head=True)
        
        return officer

    def authorize_staff(self):
        test_user = {
            "username": "@testOfficer",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
        }
        
        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testOfficer", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.assign_officer_to_department(test_user)

    def assign_officer_to_department(self, test_user):
        user, _ = User.objects.get_or_create(username=test_user["username"], defaults=test_user)
        
        officer = Officer.objects.create(user=user, department=self.department_1)
        
        return officer


    def test_get_request_succeeds_and_returns_officer_1_who_is_assigned_to_the_same_department_when_making_the_request_with_an_officer(self):
        self.authorize_staff()

        response = self.client.get(reverse("all-officers"))

        self.assertEqual(response.status_code, 200)
        
        self.assertEqual(response.data["officers"][0]["id"], 1)
        self.assertEqual(response.data["officers"][0]["user"]["id"], 1)
        self.assertEqual(response.data["officers"][0]["user"]["username"], "Username")
        self.assertEqual(response.data["officers"][0]["department"], 1)
        self.assertEqual(response.data["officers"][0]["is_department_head"], False)
        
        self.assertEqual(response.data["admin"], None)


    def test_get_request_succeeds_and_returns_the_admin_when_making_the_request_with_a_chief_officer(self):
        self.authorize_chief_officer()

        self.admin = User.objects.create_superuser(id=3, username="admin", password="testpass")

        response = self.client.get(reverse("all-officers"))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data["officers"][0]["id"], 1)
        self.assertEqual(response.data["officers"][0]["user"]["id"], 1)
        self.assertEqual(response.data["officers"][0]["user"]["username"], "Username")
        self.assertEqual(response.data["officers"][0]["department"], 1)
        self.assertEqual(response.data["officers"][0]["is_department_head"], False)

        self.assertEqual(response.data["admin"]["id"], 3)
        self.assertEqual(response.data["admin"]["username"], "admin")
        
    
    @patch("api.views.get_officers_same_department")        
    def test_get_request_fails_when_get_officers_same_department_raises_an_exception(self, mock_get_officers_same_department):
        self.authorize_staff()

        mock_get_officers_same_department.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("all-officers"))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST USERNOTIFICATIONS VIEW HERE ####
class TestUserNotificationsView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.client.force_authenticate(user=self.student_user)
        self.ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=self.student_user
        )
        self.notifcation_1 = Notification.objects.create(id=1,
                                                         user_profile=self.student_user, 
                                                         ticket=self.ticket,
                                                         message="Test notification message")


    def test_get_request_succeeds_with_valid_user(self):
        response = self.client.get(reverse("user-notifications"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["notifications"][0]["id"], 1)
        self.assertEqual(response.data["notifications"][0]["user_profile"], 1)
        self.assertEqual(response.data["notifications"][0]["ticket_subject"], "Test ticket")


    @patch("api.views.get_notifications")
    def test_get_request_fails_when_get_notifications_throws_an_exception(self, mock_get_notifications):
        mock_get_notifications.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("user-notifications"))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


    def test_post_request_succeeds_with_valid_user_and_changes_read_status(self):
        response = self.client.post(reverse("user-notifications"), {"id": 1}, format="json")

        self.assertEqual(self.notifcation_1.read_status, False)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "mark success")

        self.notifcation_1.refresh_from_db()

        self.assertEqual(self.notifcation_1.read_status, True)


    def test_post_request_fails_with_invalid_notification_id(self):
        response = self.client.post(reverse("user-notifications"), {"id": 2}, format="json")

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")




#### TEST TICKETREDIRECT VIEW HERE ####
class TestTicketRedirectView(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.officer_user_1 = User.objects.create_user(username="testOfficer1", password="testpass", is_staff=True)
        self.officer_user_2 = User.objects.create_user(username="testOfficer2", password="testpass", is_staff=True)
        self.officer_user_3 = User.objects.create_user(username="testOfficer3", password="testpass", is_staff=True)

        self.super_user = User.objects.create_superuser(username="testSuperUser", password="testpass")
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        
        self.department = Department.objects.create(name="IT Support", description="Handles IT issues")
        
        self.ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=self.student_user,
            assigned_to=self.officer_user_2,
        )
        

    def authorize_super_user(self):
        test_user = {
            "username": "@testUser",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true",
            "is_superuser": "true",
        }
        
        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testUser", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def authorize_user(self):
        test_user = {
            "username": "@testOfficer",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true",
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testOfficer", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def test_post_request_fails_when_user_is_not_authenticated(self):
        updated_ticket = {'id': 1, 'due_date': make_aware(datetime(2025, 12, 31, 0, 0, 0))}
        response = self.client.post(reverse('redirect-ticket'), updated_ticket)
        
        self.assertEqual(response.status_code, 401) # not yet authenticated so the request will fail
        

    def test_post_request_succeeds_and_updates_ticket_when_user_is_authenticated(self):
        self.authorize_user()
        
        data = {'ticket': self.ticket.id, 'to_profile': self.officer_user_1.id, 'department_id': self.department.id}
        
        response = self.client.post(reverse('redirect-ticket'), data, format='json')

        self.ticket.refresh_from_db()
        
        self.assertEqual(self.ticket.assigned_to, self.officer_user_1) # ticket should now be assigned to the first officer instead of the second

        self.assertEqual(response.status_code, 201) # user is authenticated so should get a 201 created response


    def test_serializer_errors_with_invalid_post_data(self):
        self.authorize_super_user()

        department_head = Officer.objects.create(
            user = self.officer_user_3,
            department = self.department,
            is_department_head = True
        )

        data = {'ticket': 'a ticket', 'to_profile': self.officer_user_1.id, 'department_id': self.department.id}

        response = self.client.post(reverse('redirect-ticket'), data, format='json')

        self.assertEqual(response.status_code, 400) 

        self.assertIn('ticket', response.data) 


    def test_post_request_fails_with_500_when_ticket_and_to_profile_dont_exist(self):
        self.authorize_user()

        invalid_ticket = Ticket.objects.create(
            id=2,
            subject="Invalid test ticket",
            description="This is a test ticket",
            created_by=self.student_user,
            assigned_to=self.officer_user_2,
            status="Closed"
        )

        data = {'ticket': invalid_ticket.id, 'to_profile': self.officer_user_1.id, 'department_id': self.department.id}

        response = self.client.post(reverse('redirect-ticket'), data, format='json')

        self.assertEqual(response.status_code, 500) 

        self.assertEqual(response.data['error'], 'an error has occured')


    def test_post_request_succeeds_when_redirecting_to_department_head(self):
        self.authorize_super_user()

        department_head = Officer.objects.create(
            user = self.officer_user_3,
            department = self.department,
            is_department_head = True
        )

        data = {'ticket': self.ticket.id, 'to_profile': department_head.id, 'department_id': self.department.id}

        response = self.client.post(reverse('redirect-ticket'), data, format='json')

        self.assertEqual(response.status_code, 201) 


    def test_post_request_fails_when_no_department_head_exists(self):
        self.authorize_super_user()

        data = {'ticket': self.ticket.id, 'to_profile': self.officer_user_1.id, 'department_id': self.department.id}

        response = self.client.post(reverse('redirect-ticket'), data, format='json')

        self.assertEqual(response.status_code, 400)

        self.assertEqual(response.data['error'], "No department head found for this department")



#### TEST TICKETSTATUSHISTORY VIEW HERE ####
class TestTicketStatusHistoryView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=self.student_user,
        )

    def authorize_super_user(self):
        test_user = {
            "username": "@testSuperUser",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true",
            "is_superuser": "true",
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testSuperUser", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def authorize_student(self):
        test_user = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')


    def test_get_request_fails_when_user_is_not_authenticated(self):
        response = self.client.get(reverse('ticket-status-history', kwargs={'ticket_id': self.ticket.id}))

        self.assertEqual(response.status_code, 401) # not yet authenticated so the request will fail


    def test_get_request_succeeds_with_valid_data(self):
        self.authorize_super_user()
        
        response = self.client.get(reverse('ticket-status-history', kwargs={'ticket_id': self.ticket.id}))
        self.assertEqual(response.status_code, 200)


    def test_get_request_fails_with_a_student_with_invalid_permission(self):
        self.authorize_student()

        response = self.client.get(reverse('ticket-status-history', kwargs={'ticket_id': self.ticket.id}))
        self.assertEqual(response.status_code, 403) 
        self.assertEqual(response.data['error'], 'Permission denied')

    
    def test_get_request_fails_with_a_ticket_that_doesnt_exist(self):
        self.authorize_super_user()

        response = self.client.get(reverse('ticket-status-history', kwargs={'ticket_id': 2}))
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data['error'], 'An error has occurred')


### TEST TICKETPATH VIEW HERE ###
class TestTicketPathView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=self.student_user,
        )
        self.from_user = User.objects.create_user(username="fromUser", password="testpass")
        self.to_user = User.objects.create_user(username="toUser", password="tesspass")

    
    def authorize_student(self):
        test_user = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last"
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}') 


    def authorize_staff_member(self):
        test_user = {
            "username": "@testStaff",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStaff", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}') 


    def test_get_succeeds_with_valid_staff_member_and_ticket(self):
        self.authorize_staff_member()

        response = self.client.get(reverse("ticket-path", kwargs={"ticket_id": 1}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["ticket_path"], [])


    def test_get_succeeds_and_returns_a_path_for_a_valid_staff_member_and_ticket(self):
        self.authorize_staff_member()

        self.ticket_redirect = TicketRedirect.objects.create(
            id=1,
            ticket=self.ticket,
            from_profile=self.from_user,
            to_profile=self.to_user
        )

        response = self.client.get(reverse("ticket-path", kwargs={"ticket_id": 1}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["ticket_path"], [{"from_username": "fromUser", "to_username": "toUser"}])     


    def test_get_fails_with_a_student(self):
        self.authorize_student()

        response = self.client.get(reverse("ticket-path", kwargs={"ticket_id": 1}))

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["error"], "Permission denied")

    
    def test_get_fails_with_an_invalid_ticket(self):
        self.authorize_staff_member()

        response = self.client.get(reverse("ticket-path", kwargs={"ticket_id": 2}))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST OVERDUETICKETS VIEW HERE ####
class TestOverdueTicketsView(TestCase):
    def setUp(self):
        self.client = APIClient()


    def authorize_student_user_with_overdue_ticket(self):
        test_user = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last"
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.create_overdue_ticket(test_user)


    def create_overdue_ticket(self, test_user):
        
        created_by, _ = User.objects.get_or_create(username=test_user["username"], defaults=test_user) # suggested by chatGPT
        
        ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=created_by, 
            due_date=make_aware(datetime(2024, 12, 31, 0, 0, 0))
        )

        return ticket
    
    
    def authorize_student_user(self):
        test_user = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last"
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.create_ticket(test_user)

    
    def create_ticket(self, test_user):
        
        created_by, _ = User.objects.get_or_create(username=test_user["username"], defaults=test_user) # suggested by chatGPT
        
        ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=created_by, 
            due_date=make_aware(datetime(2025, 12, 31, 0, 0, 0))
        )

        return ticket


    def test_get_request_fails_when_user_is_not_authenticated(self):
        response = self.client.get(reverse('overdue-tickets'))

        self.assertEqual(response.status_code, 401) # not yet authenticated so the request will fail

    
    def test_get_request_succeeds_with_valid_overdue_ticket(self):
        self.authorize_student_user_with_overdue_ticket()

        response = self.client.get(reverse('overdue-tickets'))
        self.assertEqual(response.status_code, 200)

        # get the details of the first and only ticket in the list of ticket dictionaries
        self.assertEqual(response.data['tickets'][0]['id'], 1)
        self.assertEqual(response.data['tickets'][0]['subject'], 'Test ticket')
        self.assertEqual(response.data['tickets'][0]['description'], 'This is a test ticket')


    def test_get_request_still_succeeds_with_no_overdue_tickets(self):
        self.authorize_student_user()

        response = self.client.get(reverse('overdue-tickets'))
        self.assertEqual(response.status_code, 200)

        # empty list returned in the response as there is no overdue tickets
        self.assertEqual(response.data['tickets'], [])


    @patch('api.views.get_overdue_tickets')
    def test_get_request_fails_when_get_overdue_tickets_raises_an_exception(self, mock_get_overdue_tickets):
        self.authorize_student_user()
       
        mock_get_overdue_tickets.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("overdue-tickets"))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST UNANSWEREDTICKETS VIEW HERE ####
class TestUnansweredTicketsView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")

    def authorize_student(self):
        test_student = {
            "username": "@testStudent",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last"
        }
        
        self.client.post(reverse("register"), test_student)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStudent", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.create_ticket_for_student(test_student)

    def create_ticket_for_student(self, student_data):
        created_by, _ = User.objects.get_or_create(username=student_data["username"], defaults=student_data)

        ticket = Ticket.objects.create(
            subject="Test ticket 1",
            description="This is a test ticket",
            created_by=created_by,
            status="Awaiting Student"
        )

        return ticket

    def authorize_staff(self):
        test_staff = {
            "username": "@testStaff",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
        }
        
        self.client.post(reverse("register"), test_staff)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStaff", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

        self.create_ticket_for_staff(test_staff)

    def create_ticket_for_staff(self, staff_data):
        assigned_to, _ = User.objects.get_or_create(username=staff_data["username"], defaults=staff_data)

        ticket = Ticket.objects.create(
            id=2,
            subject="Test ticket 2",
            description="This is a test ticket",
            created_by=self.student_user,
            assigned_to=assigned_to,
            status="Open"
        )

        return ticket

    


    def test_get_request_succeeds_with_valid_student(self):
        self.authorize_student()

        response = self.client.get(reverse("unanswered-tickets"))

        self.assertEqual(response.status_code, 200)
        
        # Should return the details of the ticket created by the student user
        self.assertEqual(response.data["tickets"][0]["id"], 1)
        self.assertEqual(response.data["tickets"][0]["subject"], "Test ticket 1")
        self.assertEqual(response.data["tickets"][0]["description"], "This is a test ticket")


    def test_get_request_succeeds_with_valid_staff(self):
        self.authorize_staff()

        response = self.client.get(reverse("unanswered-tickets"))

        self.assertEqual(response.status_code, 200)

        # Should return the details of the ticket assigned to the staff member
        self.assertEqual(response.data["tickets"][0]["id"], 2)
        self.assertEqual(response.data["tickets"][0]["subject"], "Test ticket 2")
        self.assertEqual(response.data["tickets"][0]["description"], "This is a test ticket")

    
    @patch('api.views.get_unanswered_tickets')
    def test_get_request_fails_when_get_unanswered_tickets_raises_an_exception(self, mock_get_unanswered_tickets):
        self.authorize_student()
       
        mock_get_unanswered_tickets.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("unanswered-tickets"))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")

        



#### TEST CHANGETICKETDATE VIEW HERE ####
class TestChangeTicketDateView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.ticket = Ticket.objects.create(
            id=1,
            subject="Test ticket",
            description="This is a test ticket",
            created_by=self.student_user,
            due_date=make_aware(datetime(2025, 12, 25, 0, 0, 0)),
        )

    def authorize_user(self):
        test_user = {
            "username": "@testUser",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true"
                    }
        
        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testUser", 
                                     "password": "testpass"})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}')

    def test_post_request_fails_when_user_is_not_authenticated(self):
        updated_ticket = {'id': 1, 'due_date': make_aware(datetime(2025, 12, 31, 0, 0, 0))}
        response = self.client.post(reverse('change-ticket-date'), updated_ticket)
        
        self.assertEqual(response.status_code, 401) # not yet authenticated so the request will fail
        

    def test_post_request_succeeds_and_updates_ticket_when_user_is_authenticated(self):
        self.authorize_user()

        updated_ticket = {'id': 1, 'due_date': make_aware(datetime(2025, 12, 31, 0, 0, 0))}
        response = self.client.post(reverse('change-ticket-date'), updated_ticket)

        self.ticket.refresh_from_db()

        self.assertEqual(self.ticket.due_date, updated_ticket["due_date"]) # ticket should have updated due date
        
        self.assertEqual(response.status_code, 201) # user is authenticated so should get a 201 created response


    def test_post_request_fails_with_404_when_ticket_doesnt_exist(self):
        self.authorize_user()

        updated_ticket = {'id': 2, 'due_date': make_aware(datetime(2025, 12, 31, 0, 0, 0))}
        response = self.client.post(reverse('change-ticket-date'), updated_ticket)

        self.assertEqual(response.status_code, 404) 

    
    def test_serializer_errors_with_invalid_post_data(self):
        self.authorize_user()

        invalid_ticket = {'id': 'one', 'due_date': 'thursday 5th'}
        response = self.client.post(reverse('change-ticket-date'), invalid_ticket)

        self.assertEqual(response.status_code, 400) 

        self.assertIn('id', response.data) # id is invalid so should be in the serializer errors
        self.assertIn('due_date', response.data) # due_date is invalid so should also be in the serializer errors


    def test_post_request_fails_with_400_when_new_date_is_in_the_past(self):
        self.authorize_user()

        invalid_ticket = {'id': 1, 'due_date': make_aware(datetime(2024, 12, 31, 0, 0, 0))}
        response = self.client.post(reverse('change-ticket-date'), invalid_ticket)

        self.assertEqual(response.status_code, 400)

        self.assertEqual(response.data['error'], 'You cannot change the due date to be in the past.')


    @patch('api.views.changeTicketDueDate')
    def test_get_request_fails_when_changeTicketDueDate_raises_an_exception(self, mock_changeTicketDueDate):
        self.authorize_user()
       
        mock_changeTicketDueDate.side_effect = Exception("An exception was raised")

        updated_ticket = {'id': 1, 'due_date': make_aware(datetime(2025, 12, 31, 0, 0, 0))}
        response = self.client.post(reverse("change-ticket-date"), updated_ticket)

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred")


#### TEST DEPARTMENTSLIST VIEW HERE ####
class TestDepartmentsListView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.client.force_authenticate(user=self.student_user)


    def test_get_request_succeeds_with_valid_departments_instantiated(self):
        department_one = Department.objects.create(name="IT Support", description="Handles IT Issues")
        department_two = Department.objects.create(name="Housing", description="Handles Housing Issues")

        response = self.client.get(reverse("departments-list"))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data[0]["id"], 1)
        self.assertEqual(response.data[0]["name"], "IT Support")
        self.assertEqual(response.data[0]["description"], "Handles IT Issues")

        self.assertEqual(response.data[1]["id"], 2)
        self.assertEqual(response.data[1]["name"], "Housing")
        self.assertEqual(response.data[1]["description"], "Handles Housing Issues")


    @patch("api.views.Department.objects.all")
    def test_get_request_fails_when_accessing_all_department_objects_raises_an_exception(self, mock_all_departments):
        mock_all_departments.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("departments-list"))

        self.assertEqual(response.status_code, 500)

