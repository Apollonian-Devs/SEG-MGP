from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from api.models import Ticket, Department

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


    def test_get_request_succeeds_with_no_departments(self):
        response = self.client.get(reverse("departments-list"))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data, [])

    @patch("api.views.department_views.Department.objects.all")
    def test_get_request_fails_when_accessing_all_department_objects_raises_an_exception(self, mock_all_departments):
        mock_all_departments.side_effect = Exception("An exception was raised")

        response = self.client.get(reverse("departments-list"))

        self.assertEqual(response.status_code, 500)


#### TEST SUGGESTDEPARTMENTVIEW HERE ####
class TestSuggestDepartmentView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_user = User.objects.create_user(username="testStudent", password="testpass")
        self.client.force_authenticate(user=self.student_user)
        self.ticket = Ticket.objects.create(id=1, 
                                       subject="Test ticket",
                                       description="This is a test ticket",
                                       created_by=self.student_user)


    def test_post_request_succeeds_with_valid_ticket_id_and_description_with_a_department_in_the_system(self):
        department = Department.objects.create(name="IT Support", description="Handles IT Issues")

        data = {"ticket_id": self.ticket.id, "description": self.ticket.description}

        response = self.client.post(reverse("suggest-deparment"), data, format="json")

        self.assertEqual(response.status_code, 200)


    def test_post_request_fails_with_status_code_400_if_there_is_invalid_data(self):
        data = {"ticket_id": self.ticket.id}

        response = self.client.post(reverse("suggest-deparment"), data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Ticket ID and description are required.")


    def test_post_request_fails_with_status_code_404_if_the_ticket_doesnt_exist(self):

        data = {"ticket_id": 2, "description": self.ticket.description}

        response = self.client.post(reverse("suggest-deparment"), data, format="json")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "Ticket not found.")


    def test_post_request_fails_with_status_code_500_if_there_are_no_departments_in_the_system(self):
        data = {"ticket_id": self.ticket.id, "description": self.ticket.description}

        response = self.client.post(reverse("suggest-deparment"), data, format="json")

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "No departments found in the system.")

    
    @patch("api.DepartmentSuggestionAI.open")
    def test_post_request_fails_with_status_code_500_if_the_training_data_file_isnt_found(self, mock_training_data):
        mock_training_data.side_effect = FileNotFoundError("File not found")

        department = Department.objects.create(name="IT Support", description="Handles IT Issues")

        data = {"ticket_id": self.ticket.id, "description": self.ticket.description}

        response = self.client.post(reverse("suggest-deparment"), data, format="json")

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data["error"], "Training data file not found.")

