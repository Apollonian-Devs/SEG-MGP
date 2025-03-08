from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Ticket, Department, Officer, TicketMessage, TicketAttachment
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import datetime
from rest_framework import status
from django.utils.timezone import make_aware


### TEST TICKETLISTCREATE VIEW HERE ###
class TestTicketListCreateView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="student1", password="testpass")
        self.client.force_authenticate(user=self.student_user)

        self.ticket = Ticket.objects.create(
            subject="Test ticket 1",
            description="This is a test ticket",
            created_by=self.student_user
        )

    
    def test_post_request_succeeds_and_creates_ticket_with_valid_data(self):
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
        self.assertEqual(Ticket.objects.all()[1].created_by, self.student_user)
    

    def test_get_request_succeeds_with_valid_user(self):
        response = self.client.get(reverse("ticket-list"))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data[0]['id'], 1)
        self.assertEqual(response.data[0]['subject'], "Test ticket 1")
        self.assertEqual(response.data[0]['description'], "This is a test ticket")
        self.assertEqual(response.data[0]['created_by'], self.student_user.id)



#### TEST TICKETCHANGESTATUS VIEW HERE ####


#### TEST TICKETCHANGEPRIORITY VIEW HERE ####


#### TEST TICKETDELETE VIEW HERE ####


#### TEST CURRENTUSER VIEW HERE ####


#### TEST USERTICKETS VIEW HERE ####


#### TEST TICKETSENDRESPONSE VIEW HERE ####


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


    ## Not sure how to test exception in TicketMessageHistory ???


#### TEST ALLOFFICERSVIEW VIEW HERE ####


#### TEST USERNOTIFICATIONS VIEW HERE ####


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


    def test_post_request_fails_with_400_when_ticket_and_to_profile_dont_exist(self):
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

        self.assertEqual(response.status_code, 400) 

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
        self.assertEqual(response.data['error'], 'Ticket matching query does not exist.')


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


#### TEST DEPARTMENTSLIST VIEW HERE ####


#### TEST RANDOMDEPARTMENT VIEW HERE ####
