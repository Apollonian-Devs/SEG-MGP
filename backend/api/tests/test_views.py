from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Ticket, Department
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import datetime
from rest_framework import status

class TicketTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="student1", password="testpass")
        self.client.force_authenticate(user=self.student_user)

        self.department = Department.objects.create(name="IT Support", description="Handles IT issues")

        self.superuser = User.objects.create_superuser(username="admin", password="adminpass")

        self.ticket = Ticket.objects.create(
            subject="Test Issue",
            description="This is a test ticket",
            created_by=self.student_user
        )

    def test_ticket_creation(self):
        """Test that a ticket can be created correctly"""
        self.assertEqual(Ticket.objects.count(), 1)
        self.assertEqual(self.ticket.subject, "Test Issue")
        self.assertEqual(self.ticket.description, "This is a test ticket")
        self.assertEqual(self.ticket.status, "Open")

    def test_ticket_restriction_for_staff(self):
        """Test that staff users cannot create tickets"""
        staff_user = User.objects.create_user(username="staff1", password="testpass", is_staff=True)
        with self.assertRaises(Exception):
            Ticket.objects.create(
                subject="Invalid Issue",
                description="Staff should not be able to create tickets",
                created_by=staff_user
            )

    def test_ticket_list_view(self):
        """Test that the ticket list API returns a 200 response"""
        response = self.client.get("/api/tickets/")
        self.assertEqual(response.status_code, 200)



class TestChangeTicketDateView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.officer_user = User.objects.create_user(username="testOfficer", password="testpass", is_staff=True)
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.ticket = Ticket.objects.create(
            subject="Test ticket",
            description="This is a test ticket",
            created_by=self.student_user
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
        sample_post = {'id': 1, 'due_date': datetime(2025, 12, 31, 0, 0, 0)}
        response = self.client.post(reverse('change-ticket-date'), sample_post)
        
        self.assertEqual(response.status_code, 401) # not yet authenticated so the request will fail
        

    def test_post_request_succeeds_when_user_is_authenticated(self):
        self.authorize_user()

        sample_post = {'id': 1, 'due_date': datetime(2025, 12, 31, 0, 0, 0)}
        response = self.client.post(reverse('change-ticket-date'), sample_post)
        
        self.assertEqual(response.status_code, 201) # user is authenticated so should get a 201 created response
        