from django.test import TestCase
from django.db import IntegrityError
from django.contrib.auth.models import User
from api.models import Department

class DepartmentTests(TestCase):
    def test_create_department_with_all_fields(self):
        dept = Department.objects.create(
            name="IT",
            description="IT Department"
        )
        self.assertEqual(dept.name, "IT")
        self.assertEqual(dept.description, "IT Department")

    def test_create_department_without_description(self):
        dept = Department.objects.create(name="HR")
        self.assertIsNone(dept.description)

    def test_department_name_uniqueness(self):
        Department.objects.create(name="Finance")
        with self.assertRaises(IntegrityError):
            Department.objects.create(name="Finance")

    def test_string_representation(self):
        dept = Department.objects.create(name="Marketing")
        self.assertEqual(str(dept), "Marketing")
