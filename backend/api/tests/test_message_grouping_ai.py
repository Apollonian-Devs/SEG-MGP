from api.MessagesGroupingAI import *
from unittest import mock
from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from api.models import Ticket, Department, AIResponse
import numpy as np
from unittest.mock import MagicMock

class TestMessageGroupingAI(TestCase):
    @mock.patch('api.MessagesGroupingAI.SentenceTransformer')
    @mock.patch('api.MessagesGroupingAI.cosine_distances')
    @mock.patch('api.MessagesGroupingAI.hdbscan.HDBSCAN')
    def test_MessageGroupAI(self, mock_hdbscan, mock_cosine_distances, mock_SentenceTransformer):
        mock_SentenceTransformer.return_value.encode.return_value = np.array([[1, 2], [3, 4], [5, 6]])
        mock_cosine_distances.return_value = np.array([[0, 1, 2], [1, 0, 3], [2, 3, 0]])
        mock_hdbscan.return_value.fit_predict.return_value = np.array([0, 1, 0])
        mock_hdbscan.return_value.probabilities_ = np.array([0.1, 0.2, 0.3])

        sentences = ["Hello, how are you?", "I am fine, thank you.", "Goodbye!"]
        clusters, probabilities = MessageGroupAI(sentences)

        self.assertEqual(clusters.tolist(), [0, 1, 0])

        self.assertEqual(probabilities.tolist(), [0.1, 0.2, 0.3])
        mock_SentenceTransformer.assert_called_once_with('all-MiniLM-L6-v2')
        mock_SentenceTransformer.return_value.encode.assert_called_once_with(sentences)
        called_args = mock_cosine_distances.call_args[0][0]
        np.testing.assert_array_equal(called_args, np.array([[1, 2], [3, 4], [5, 6]]))

        mock_hdbscan.assert_called_once_with(
            min_cluster_size=2,  
            min_samples=1,       
            metric='precomputed',
            cluster_selection_method='eom',
            cluster_selection_epsilon=0.001 
        )
        called_distance_matrix = mock_hdbscan.return_value.fit_predict.call_args[0][0]
        np.testing.assert_array_equal(called_distance_matrix, np.array([[0, 1, 2], [1, 0, 3], [2, 3, 0]]))

        self.assertEqual(mock_hdbscan.return_value.probabilities_.tolist(), [0.1, 0.2, 0.3])

    @mock.patch('api.MessagesGroupingAI.SentenceTransformer')
    @mock.patch('api.MessagesGroupingAI.cosine_distances')
    @mock.patch('api.MessagesGroupingAI.hdbscan.HDBSCAN')

    def test_MessageGroupAI_less_than_2_sentences(self, mock_hdbscan, mock_cosine_distances, mock_SentenceTransformer):
        with self.assertRaises(ValueError):
            MessageGroupAI(["Hello, how are you?"])

        mock_SentenceTransformer.assert_not_called()
        mock_cosine_distances.assert_not_called()
        mock_hdbscan.assert_not_called()
