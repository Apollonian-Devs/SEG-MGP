from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Officer, Department
from django.core.exceptions import PermissionDenied, ValidationError
from api.helpers import get_department_head

class TestGetDepartmentHead(TestCase):

    def setUp(self):

        self.department = Department.objects.create(name="Test Dept", description="Test Department")
        
        self.user1 = User.objects.create_user(username="TestUser1", password="password")
        self.user2 = User.objects.create_user(username="TestUser2", password="password")

    def test_returns_user_if_department_has_department_head(self):
        Officer.objects.create(user=self.user1, department=self.department, is_department_head=True)
        Officer.objects.create(user=self.user2, department=self.department, is_department_head=False)

        result = get_department_head(self.department.id)

        self.assertEqual(result, self.user1)


    def test_returns_first_department_head_if_multiple(self):
        Officer.objects.create(user=self.user1, department=self.department, is_department_head=True)
        Officer.objects.create(user=self.user2, department=self.department, is_department_head=True)

        result = get_department_head(self.department.id)

        self.assertEqual(result, self.user1)


    def test_returns_none_if_no_department_head(self):
        Officer.objects.create(user=self.user1, department=self.department, is_department_head=False)
        Officer.objects.create(user=self.user2, department=self.department, is_department_head=False)

        result = get_department_head(self.department.id)

        self.assertIsNone(result)
