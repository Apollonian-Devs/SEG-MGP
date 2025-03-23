from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Officer, Department
from django.core.exceptions import PermissionDenied, ValidationError
from api.helpers import get_department_head

class TestGetDepartmentHead(TestCase):

    def test_returns_user_if_department_has_department_head(self):

        department = Department.objects.create(name="Test Dept", description="Test Department")

        user1 = User.objects.create_user(username="officer1", password="password")
        user2 = User.objects.create_user(username="officer2", password="password")

        officer1 = Officer.objects.create(user=user1, department=department, is_department_head=True)
        officer2 = Officer.objects.create(user=user2, department=department, is_department_head=False)

        result = get_department_head(department.id)
        assert result == user1
    
    def test_returns_none_if_no_department_head(self):
        department = Department.objects.create(name="Test Dept", description="Test Department")

        user1 = User.objects.create_user(username="officer1", password="password")
        user2 = User.objects.create_user(username="officer2", password="password")

        officer1 = Officer.objects.create(user=user1, department=department, is_department_head=False)
        officer2 = Officer.objects.create(user=user2, department=department, is_department_head=False)

        result = get_department_head(department.id)
        assert result is None