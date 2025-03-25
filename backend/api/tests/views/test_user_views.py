from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Ticket, Department, Officer, TicketMessage, TicketAttachment, TicketRedirect, Notification
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import datetime
from rest_framework import status
from django.utils.timezone import make_aware
from unittest.mock import patch


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
        
    
    @patch("api.views.user_views.get_officers_same_department")       
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


    @patch("api.views.user_views.get_notifications")
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

