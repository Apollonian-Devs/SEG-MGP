from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Ticket, Department, Officer, TicketMessage, TicketAttachment, TicketRedirect, Notification
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import datetime
from rest_framework import status
from django.utils.timezone import make_aware
from unittest.mock import patch


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