import json
import tempfile
import os
from unittest import mock
from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from api.models import Ticket, Department, AIResponse
from api.DepartmentSuggestionAI import suggest_department
import numpy as np
from unittest.mock import MagicMock



class SuggestDepartmentTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='student', password='pass')
        self.ticket = Ticket.objects.create(
            subject="Issue A",
            description="My laptop won't connect to the university WiFi.",
            created_by=self.user
        )
        self.department = Department.objects.create(name="IT Support")

    def test_missing_ticket_id_or_description(self):
        resp, status = suggest_department(None, "desc")
        self.assertEqual(status, 400)
        self.assertIn("error", resp)

        resp, status = suggest_department(self.ticket.id, None)
        self.assertEqual(status, 400)
        self.assertIn("error", resp)

    def test_ticket_not_found(self):
        resp, status = suggest_department(9999, "desc")
        self.assertEqual(status, 404)
        self.assertIn("Ticket not found", resp["error"])

    def test_no_departments(self):
        Department.objects.all().delete()
        resp, status = suggest_department(self.ticket.id, "WiFi issue in dorm")
        self.assertEqual(status, 500)
        self.assertIn("No departments found", resp["error"])

    @override_settings(BASE_DIR=tempfile.gettempdir())
    def test_training_data_file_missing(self):

        file_path = os.path.join(tempfile.gettempdir(), 'training_data.json')
        if os.path.exists(file_path):
            os.remove(file_path)

        resp, status = suggest_department(self.ticket.id, "Network is not working")
        self.assertEqual(status, 500)
        self.assertIn("Training data file not found", resp["error"])

    @override_settings(BASE_DIR=tempfile.gettempdir())
    @mock.patch("api.DepartmentSuggestionAI.TfidfVectorizer")
    @mock.patch("api.DepartmentSuggestionAI.hdbscan.HDBSCAN")
    def test_successful_suggestion_with_known_department(self, mock_hdbscan_cls, mock_tfidf_cls):
        training_data = [
            {"description": "Cannot access email", "department": "IT Support"},
            {"description": "WiFi is down", "department": "IT Support"},
        ]
        training_data_path = os.path.join(tempfile.gettempdir(), 'training_data.json')
        with open(training_data_path, 'w') as f:
            json.dump(training_data, f)

        mock_vectorizer = mock.Mock()
        mock_matrix = mock.Mock()
        mock_matrix.toarray.return_value = [[0.1], [0.2], [0.3]]
        mock_vectorizer.fit_transform.return_value = mock_matrix
        mock_tfidf_cls.return_value = mock_vectorizer

        mock_clusterer = mock.Mock()
        mock_clusterer.fit_predict.return_value = [0, 0, 0]
        mock_clusterer.probabilities_ = [0.8, 0.9, 0.95]
        mock_hdbscan_cls.return_value = mock_clusterer

        resp, status = suggest_department(self.ticket.id, "WiFi not connecting in lab")
        self.assertEqual(status, 200)
        self.assertIn("suggested_department", resp)
        self.assertIn("confidence_score", resp)

        ai_response = AIResponse.objects.get(ticket=self.ticket)
        self.assertEqual(ai_response.response_text, "IT Support")

        


    @override_settings(BASE_DIR=tempfile.gettempdir())
    @mock.patch("api.DepartmentSuggestionAI.TfidfVectorizer")
    @mock.patch("api.DepartmentSuggestionAI.hdbscan.HDBSCAN")
    def test_unknown_department_due_to_cluster_label(self, mock_hdbscan_cls, mock_tfidf_cls):
        # Write dummy training data
        training_data = [
            {"description": "App crashing", "department": "Engineering"},
            {"description": "Bug in system", "department": "Engineering"},
        ]
        training_data_path = os.path.join(tempfile.gettempdir(), 'training_data.json')
        with open(training_data_path, 'w') as f:
            json.dump(training_data, f)

        # Mocks
        mock_vectorizer = mock.Mock()
        mock_matrix = MagicMock()
        mock_matrix.toarray.return_value = np.array([[0.1], [0.2], [0.3]])
        mock_vectorizer.fit_transform.return_value = mock_matrix
        mock_tfidf_cls.return_value = mock_vectorizer

        mock_clusterer = mock.Mock()
        mock_clusterer.fit_predict.return_value = [0, 0, -1]
        mock_clusterer.probabilities_ = [0.8, 0.9, 0.6]
        mock_hdbscan_cls.return_value = mock_clusterer

        resp, status = suggest_department(self.ticket.id, "Completely unrelated issue")
        self.assertEqual(status, 200)
        self.assertEqual(resp["suggested_department"], "Unknown")

    @override_settings(BASE_DIR=tempfile.gettempdir())
    @mock.patch("api.DepartmentSuggestionAI.TfidfVectorizer")
    @mock.patch("api.DepartmentSuggestionAI.hdbscan.HDBSCAN")
    def test_department_name_does_not_exist_in_db(self, mock_hdbscan_cls, mock_tfidf_cls):

        training_data = [
            {"description": "Issue with badge", "department": "Security"},
            {"description": "Swipe not working", "department": "Security"},
        ]


        training_data_path = os.path.join(tempfile.gettempdir(), 'training_data.json')
        with open(training_data_path, 'w') as f:
            json.dump(training_data, f)


        mock_vectorizer = mock.Mock()
        mock_matrix = MagicMock()
        mock_matrix.toarray.return_value = np.array([[0.1], [0.2], [0.3]])
        mock_vectorizer.fit_transform.return_value = mock_matrix
        mock_tfidf_cls.return_value = mock_vectorizer

        mock_clusterer = mock.Mock()
        mock_clusterer.fit_predict.return_value = [0, 0, 0] 
        mock_clusterer.probabilities_ = [0.8, 0.9, 0.95]
        mock_hdbscan_cls.return_value = mock_clusterer

        resp, status = suggest_department(self.ticket.id, "Access card not working")
        self.assertEqual(status, 200)
        self.assertEqual(resp["suggested_department"], "Unknown")
