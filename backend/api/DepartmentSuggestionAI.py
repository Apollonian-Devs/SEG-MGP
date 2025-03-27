import os
import json
from sklearn.feature_extraction.text import TfidfVectorizer
import hdbscan
from api.models import Ticket, Department, AIResponse
from api.serializers import DepartmentSerializer
from django.conf import settings

def validate_input(ticket_id, ticket_description):
    """Validates required ticket ID and description exist."""
    if not ticket_id or not ticket_description:
        return {"error": "Ticket ID and description are required."}, 400
    return None

def get_ticket(ticket_id):
    """Retrieves ticket by ID or returns error response."""
    try:
        return Ticket.objects.get(id=ticket_id), None
    except Ticket.DoesNotExist:
        return None, ({"error": "Ticket not found."}, 404)

def get_departments_list():
    """Retrieves all departments or returns error if none exist."""
    departments = Department.objects.all()
    if not departments:
        return None, ({"error": "No departments found in the system."}, 500)
    return departments, None

def load_training_data():
    """Loads historical ticket data for training."""
    training_data_path = os.path.join(settings.BASE_DIR, 'training_data.json')
    try:
        with open(training_data_path, 'r') as f:
            return json.load(f), None
    except FileNotFoundError:
        return None, ({"error": "Training data file not found."}, 500)

def vectorize_descriptions(training_descriptions, ticket_description):
    """Converts text to TF-IDF vectors for clustering."""
    vectorizer = TfidfVectorizer()
    all_descriptions = training_descriptions + [ticket_description]
    return vectorizer.fit_transform(all_descriptions)

def perform_clustering(X):
    """Clusters documents using HDBSCAN algorithm."""
    clusterer = hdbscan.HDBSCAN(min_cluster_size=2, min_samples=1, metric='euclidean')
    return clusterer.fit_predict(X.toarray()), clusterer

def map_clusters_to_departments(cluster_labels, training_departments):
    """Maps cluster labels to department names."""
    cluster_to_department = {}
    for i, label in enumerate(cluster_labels[:-1]):
        if label != -1:
            cluster_to_department[label] = training_departments[i]
    return cluster_to_department

def get_suggestion(cluster_labels, cluster_to_department, clusterer):
    """Determines suggested department based on clustering results."""
    new_ticket_cluster = cluster_labels[-1]
    confidence_score = clusterer.probabilities_[-1] if clusterer.probabilities_ is not None else 0.0
    return cluster_to_department.get(new_ticket_cluster, "Unknown"), confidence_score

def fetch_department(suggested_department):
    """Retrieves department object by name."""
    try:
        return Department.objects.get(name=suggested_department)
    except Department.DoesNotExist:
        return None

def save_ai_response(ticket, ticket_description, suggested_department, confidence_score):
    """Stores AI suggestion in database."""
    AIResponse(
        ticket=ticket,
        prompt_text=ticket_description,
        response_text=suggested_department,
        confidence=confidence_score * 100,
        verification_status="Pending"
    ).save()

def format_response(department, suggested_department, confidence_score):
    """Formats API response with department data."""
    if department:
        suggested_department = DepartmentSerializer(department).data
    return {
        "suggested_department": suggested_department,
        "confidence_score": float(confidence_score)
    }

def suggest_department(ticket_id, ticket_description):
    """
    Main function that suggests department for a ticket using HDBSCAN clustering.
    
    @param ticket_id: ID of ticket to classify
    @param ticket_description: Text content to analyze
    @return: Tuple (response_data, status_code)
    """
    # Validate and retrieve required data
    if error := validate_input(ticket_id, ticket_description):
        return error
    ticket, error = get_ticket(ticket_id)
    if error:
        return error
    departments, error = get_departments_list()
    if error:
        return error
    training_data, error = load_training_data()
    if error:
        return error

    # Process data and generate suggestion
    training_descriptions = [item['description'] for item in training_data]
    training_departments = [item['department'] for item in training_data]
    
    X = vectorize_descriptions(training_descriptions, ticket_description)
    cluster_labels, clusterer = perform_clustering(X)
    cluster_to_department = map_clusters_to_departments(cluster_labels, training_departments)
    suggested_department, confidence_score = get_suggestion(cluster_labels, cluster_to_department, clusterer)
    
    # Format and store results
    department = fetch_department(suggested_department)
    response_data = format_response(department, suggested_department or "Unknown", confidence_score)
    save_ai_response(ticket, ticket_description, suggested_department, confidence_score)
    
    return response_data, 200