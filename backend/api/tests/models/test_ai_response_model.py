from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from time import sleep
from datetime import timedelta

from django.contrib.auth.models import User
from api.models import Ticket, AIResponse



class AIResponseTestCase(TestCase):
    def setUp(self):
        """Set up test users and ticket"""
        self.user1 = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpassword'
        )

        self.ticket = Ticket.objects.create(
            subject='Test Ticket',
            description='This is a test ticket',
            created_by=self.user1,
            assigned_to=self.user2,
            status='Open',
            priority='Low'
        )

        self.ai_response = AIResponse.objects.create(
            ticket=self.ticket,
            prompt_text='Test prompt',
            response_text='Test response',
            confidence=95.0,  # Fixed confidence value
            verified_by_profile=self.user2,
            verification_status='Verified'
        )

    def test_ai_response_str(self):
        """Ensure __str__ is formatted correctly."""
        expected_str = f"AI Response #{self.ai_response.id} for Ticket #{self.ai_response.ticket.id}"
        self.assertEqual(str(self.ai_response), expected_str)

    def test_valid_ai_response_is_valid(self):
        """Check that a default valid AIResponse passes validation."""
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("Default test AIResponse should be valid.")

    def test_confidence_range(self):
        """Check that confidence is within 0-100."""
        self.ai_response.confidence = 101
        with self.assertRaises(ValidationError):
            self.ai_response.full_clean()

        self.ai_response.confidence = -1
        with self.assertRaises(ValidationError):
            self.ai_response.full_clean()

        self.ai_response.confidence = 0
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("AIResponse with confidence=0 should be valid.")

        self.ai_response.confidence = 100
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("AIResponse with confidence=100 should be valid.")

        self.ai_response.confidence = 50
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("AIResponse with confidence=50 should be valid.")

    def test_confidence_is_optional(self):
        """confidence can be None."""
        self.ai_response.confidence = None
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("AIResponse with confidence=None should be valid.")

    def test_verification_status_is_optional(self):
        """verification_status can be None."""
        self.ai_response.verification_status = None
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("AIResponse with verification_status=None should be valid.")

    def test_verified_by_profile_is_optional(self):
        """verified_by_profile can be None."""
        self.ai_response.verified_by_profile = None
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("AIResponse with verified_by_profile=None should be valid.")

    def test_prompt_text_is_optional(self):
        """prompt_text can be None."""
        self.ai_response.prompt_text = None
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("AIResponse with prompt_text=None should be valid.")

    def test_response_text_is_optional(self):
        """response_text can be None."""
        self.ai_response.response_text = None
        try:
            self.ai_response.full_clean()
        except ValidationError:
            self.fail("AIResponse with response_text=None should be valid.")

    def test_created_at_is_auto_now(self):
        """created_at should be set to now on creation."""
        now_time = now()
        self.assertLess((self.ai_response.created_at - now_time), timedelta(seconds=1))

    def test_created_at_does_not_update(self):
        """created_at should not update on save."""
        old_created_at = self.ai_response.created_at
        sleep(1)
        self.ai_response.save()
        self.ai_response.refresh_from_db()
        self.assertEqual(self.ai_response.created_at, old_created_at)

    def test_ticket_must_exist(self):
        """ticket must exist."""
        self.ai_response.ticket = None
        with self.assertRaises(ValidationError):
            self.ai_response.full_clean()

    def test_ai_response_str_with_null_ticket(self):
        """Test __str__ with a null ticket for safety."""
        self.ai_response.ticket = None
        with self.assertRaises(AttributeError):  # Expected error
            str(self.ai_response)
