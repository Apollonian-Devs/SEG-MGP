from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, ValidationError
from api.helpers import validate_redirection

class TestValidateRedirection(TestCase):

    def setUp(self):
        self.student_user = User.objects.create_user(username="student", email="student@gmail.com", password="password")
        self.staff_user = User.objects.create_user(username="staff", email="staff@gmail.com", password="password", is_staff=True)
        self.admin_user = User.objects.create_user(username="admin", email="admin@gmail.com", password="password", is_superuser=True)

    def test_validate_redirection_permission_denied_for_student(self):
        """
        Test that a student (non-staff, non-superuser) cannot redirect tickets.
        """
        with self.assertRaises(PermissionDenied):
            validate_redirection(self.student_user, self.admin_user)

    def test_validate_redirection_success_for_staff(self):
        """
        Test that a staff user CAN redirect tickets.
        """
        validate_redirection(self.staff_user, self.student_user)  # Should pass

    def test_validate_redirection_success_for_superuser(self):
        """
        Test that a superuser CAN redirect tickets.
        """
        validate_redirection(self.admin_user, self.student_user)  # Should pass

    def test_validate_redirection_raises_validation_error_for_same_user(self):
        """
        Test that a user cannot redirect a ticket to themselves.
        """
        with self.assertRaises(ValidationError):
            validate_redirection(self.staff_user, self.staff_user)
        with self.assertRaises(ValidationError):
            validate_redirection(self.admin_user, self.admin_user)

    def test_validate_redirection_success_between_staff_and_superuser(self):
        """
        Test redirection between staff and superuser.
        """
        validate_redirection(self.staff_user, self.admin_user)
        validate_redirection(self.admin_user, self.staff_user)

    def test_validate_redirection_success_between_staff_users(self):
        """
        Test redirection between two staff users.
        """
        staff_user2 = User.objects.create_user(username="staff2", email="staff2@gmail.com", password="password", is_staff=True)
        validate_redirection(self.staff_user, staff_user2)
        validate_redirection(staff_user2, self.staff_user)

    def test_validate_redirection_success_between_superusers(self):
        """
        Test redirection between two superusers.
        """
        admin_user2 = User.objects.create_user(username="admin2", email="admin2@gmail.com", password="password", is_superuser=True)
        validate_redirection(self.admin_user, admin_user2)
        validate_redirection(admin_user2, self.admin_user)

    def test_validate_redirection_with_none_user(self):
        """
        Test that None values in either argument raise PermissionDenied.
        """
        with self.assertRaises(PermissionDenied):
            validate_redirection(None, self.student_user)
        with self.assertRaises(PermissionDenied):
            validate_redirection(self.staff_user, None)
        with self.assertRaises(PermissionDenied):
            validate_redirection(None, None)
