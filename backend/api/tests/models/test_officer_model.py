from django.test import TestCase
from django.db import IntegrityError
from django.contrib.auth.models import User
from api.models import Officer, Department


class OfficerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="officer_user")
        self.department = Department.objects.create(name="IT")

    def test_create_officer(self):
        officer = Officer.objects.create(
            user=self.user,
            department=self.department
        )
        self.assertEqual(officer.user, self.user)
        self.assertEqual(officer.department, self.department)
        self.assertFalse(officer.is_department_head)

    def test_is_department_head_true(self):
        officer = Officer.objects.create(
            user=self.user,
            department=self.department,
            is_department_head=True
        )
        self.assertTrue(officer.is_department_head)

    def test_string_representation(self):
        officer = Officer.objects.create(
            user=self.user,
            department=self.department
        )
        self.assertEqual(str(officer), "officer_user")

    def test_one_to_one_user_constraint(self):
        Officer.objects.create(user=self.user, department=self.department)
        with self.assertRaises(IntegrityError):
            Officer.objects.create(user=self.user, department=self.department)
