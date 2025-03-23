from django.test import TestCase
from django.contrib.auth.models import User
from unittest.mock import patch, MagicMock
from django.core.exceptions import PermissionDenied, ValidationError
from api.helpers import send_email


class TestSendEmail(TestCase):

    @patch("api.helpers.yagmail.SMTP")
    def test_email_sent_successfully(self, mock_yagmail):

        user = User.objects.create_user(
            username="TestUser", 
            email="testemail@example.com", 
            password="password"
        )

        mock_smtp_instance = MagicMock()
        mock_yagmail.return_value = mock_smtp_instance

        send_email(user, "Test Subject", "Test Body")

        mock_smtp_instance.send.assert_called_once_with(
            to=user.email,
            subject="Test Subject",
            contents="Test Body",

        )

    @patch("api.helpers.yagmail.SMTP")
    def test_email_not_sent_if_no_user(self, mock_yagmail):

        mock_smtp_instance = MagicMock()
        mock_yagmail.return_value = mock_smtp_instance

        send_email(None, "Test Subject", "Test Body")

        mock_smtp_instance.send.assert_not_called()

