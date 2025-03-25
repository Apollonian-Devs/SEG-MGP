from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Ticket, Department, Officer, TicketMessage, TicketAttachment, TicketRedirect, Notification
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import datetime
from rest_framework import status
from django.utils.timezone import make_aware
from unittest.mock import patch


class TestGroupTicketsView(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")

    
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


    def authorize_admin(self):
        test_user = {
            "username": "@testStaff",
            "email": "test@email.com",
            "password": "testpass",
            "first_name": "first",
            "last_name": "last",
            "is_staff": "true",
            "is_superuser": "true",
        }

        self.client.post(reverse("register"), test_user)

        response = self.client.post(reverse("get_token"), 
                                    {"username": "@testStaff", 
                                     "password": "testpass"})
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.json()["access"]}') 

        self.admin, _ = User.objects.get_or_create(username=test_user["username"], defaults=test_user)


    def assign_ticket_to_admin(self, ticketID):
        Ticket.objects.create(
            id=ticketID,
            subject=f"Test ticket {ticketID}",
            description="This is a test ticket",
            created_by=self.student_user,
            assigned_to=self.admin
        )

    
    def test_get_request_succeeds_with_admin_user_and_more_than_2_tickets_assigned_to_the_admin(self):
        self.authorize_admin()

        self.assign_ticket_to_admin(1)
        self.assign_ticket_to_admin(2)
        self.assign_ticket_to_admin(3)

        response = self.client.get(reverse("user-tickets-grouping"))

        self.assertEqual(response.status_code, 200)

    
    def test_get_request_fails_with_less_than_2_tickets_assigned_to_the_admin(self):
        self.authorize_admin()

        self.assign_ticket_to_admin(1)

        response = self.client.get(reverse("user-tickets-grouping"))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Not enough tickets available for clustering. Need at least 2.")

    
    def test_get_request_fails_with_student_user(self):
        self.authorize_student()

        response = self.client.get(reverse("user-tickets-grouping"))

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["error"], "Permission denied")

    
    @patch("api.views.analytics_views.get_tags")
    def test_get_request_fails_if_get_tags_throws_an_exception(self, mock_get_tags):
        self.authorize_admin()

        mock_get_tags.side_effect = Exception("An exception was thrown")

        self.assign_ticket_to_admin(1)
        self.assign_ticket_to_admin(2)
        self.assign_ticket_to_admin(3)

        response = self.client.get(reverse("user-tickets-grouping"))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "An error has occurred: An exception was thrown")