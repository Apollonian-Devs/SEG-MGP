from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from unittest.mock import patch
from api.helpers import get_tags
from api.models import Ticket, AIResponse


class GetTagsTests(TestCase):
    def setUp(self):
        self.User = get_user_model()

        # ✅ Create a Superuser (Admin)
        self.admin_user = self.User.objects.create_superuser(
            username="admin", email="admin@example.com", password="password"
        )

        # ✅ Create a Regular User (Student)
        self.student_user = self.User.objects.create_user(
            username="student", email="student@example.com", password="password",
            is_staff=False, is_superuser=False 
        )

    def test_non_superuser_cannot_get_tags(self):
        """Ensure a non-admin user cannot retrieve ticket clusters."""
        with self.assertRaises(PermissionDenied):
            get_tags(self.student_user)  

    def test_not_enough_tickets(self):
        """Ensure an error is returned when there are fewer than 2 tickets."""
        Ticket.objects.create(
            subject="Single Ticket", description="Only one ticket",
            created_by=self.student_user, assigned_to=self.admin_user
        )

        result = get_tags(self.admin_user)
        self.assertIn("error", result)
        self.assertEqual(result["error"], "Not enough tickets available for clustering. Need at least 2.")

    @patch("api.helpers.MessageGroupAI")
    def test_successful_ticket_clustering(self, mock_ai):
        """Ensure tickets are correctly clustered when there are enough tickets."""
        ticket1 = Ticket.objects.create(
            subject="ID Card", description="Lost my student ID",
            created_by=self.student_user, assigned_to=self.admin_user
        )
        ticket2 = Ticket.objects.create(
            subject="Enrollment Help", description="Need help enrolling in courses",
            created_by=self.student_user, assigned_to=self.admin_user
        )

        mock_ai.return_value = ([0, 1], [0.95, 0.85]) 

        result = get_tags(self.admin_user)

        self.assertIsInstance(result, dict)
        self.assertEqual(len(result), 2)
        self.assertEqual(result[ticket1.id], 0)
        self.assertEqual(result[ticket2.id], 1)

        # Ensure AIResponse objects are created
        ai_responses = AIResponse.objects.filter(ticket__in=[ticket1, ticket2])
        self.assertEqual(ai_responses.count(), 2)

        for ai_response in ai_responses:
            self.assertEqual(ai_response.verification_status, "Verified")
            self.assertEqual(ai_response.verified_by_profile, self.admin_user)

    @patch("api.helpers.MessageGroupAI")
    def test_clustering_failure(self, mock_ai):
        """Ensure an error message is returned when clustering fails."""
        Ticket.objects.create(
            subject="Network Issue", description="Can't connect to WiFi",
            created_by=self.student_user, assigned_to=self.admin_user
        )
        Ticket.objects.create(
            subject="Email Issue", description="Not receiving emails",
            created_by=self.student_user, assigned_to=self.admin_user
        )

        mock_ai.side_effect = Exception("AI Model error")

        result = get_tags(self.admin_user)

        self.assertIn("error", result)
        self.assertTrue(result["error"].startswith("Clustering error: AI Model error"))
