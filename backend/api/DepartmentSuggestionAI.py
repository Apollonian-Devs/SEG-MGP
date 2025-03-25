import os
import json
from sklearn.feature_extraction.text import TfidfVectorizer
import hdbscan
from api.models import Ticket, Department, AIResponse
from api.serializers import DepartmentSerializer
from django.conf import settings

def validate_input(ticket_id, ticket_description):
    if not ticket_id or not ticket_description:
        return {"error": "Ticket ID and description are required."}, 400
    return None

def get_ticket(ticket_id):
    try:
        return Ticket.objects.get(id=ticket_id), None
    except Ticket.DoesNotExist:
        return None, ({"error": "Ticket not found."}, 404)

def get_departments_list():
    departments = Department.objects.all()
    if not departments:
        return None, ({"error": "No departments found in the system."}, 500)
    return departments, None

def load_training_data():
    training_data_path = os.path.join(settings.BASE_DIR, 'training_data.json')
    try:
        with open(training_data_path, 'r') as f:
            training_data = json.load(f)
        return training_data, None
    except FileNotFoundError:
        return None, ({"error": "Training data file not found."}, 500)

def vectorize_descriptions(training_descriptions, ticket_description):
    vectorizer = TfidfVectorizer()
    all_descriptions = training_descriptions + [ticket_description]
    return vectorizer.fit_transform(all_descriptions)

def perform_clustering(X):
    clusterer = hdbscan.HDBSCAN(min_cluster_size=2, min_samples=1, metric='euclidean')
    cluster_labels = clusterer.fit_predict(X.toarray())
    return cluster_labels, clusterer

def map_clusters_to_departments(cluster_labels, training_departments):
    cluster_to_department = {}
    for i, label in enumerate(cluster_labels[:-1]):
        if label != -1:
            cluster_to_department[label] = training_departments[i]
    return cluster_to_department

def get_suggestion(cluster_labels, cluster_to_department, clusterer):
    new_ticket_cluster = cluster_labels[-1]
    confidence_score = clusterer.probabilities_[-1] if clusterer.probabilities_ is not None else 0.0
    suggested_department = "Unknown"
    if new_ticket_cluster != -1:
        suggested_department = cluster_to_department.get(new_ticket_cluster, "Unknown")
    return suggested_department, confidence_score

def fetch_department(suggested_department):
    try:
        department = Department.objects.get(name=suggested_department)
        return department
    except Department.DoesNotExist:
        return None

def save_ai_response(ticket, ticket_description, suggested_department, confidence_score):
    ai_response = AIResponse(
        ticket=ticket,
        prompt_text=ticket_description,
        response_text=suggested_department,
        confidence=confidence_score * 100,
        verification_status="Pending"
    )
    ai_response.save()

def format_response(department, suggested_department, confidence_score):
    if department:
        suggested_department = DepartmentSerializer(department).data
    return {
        "suggested_department": suggested_department,
        "confidence_score": float(confidence_score)
    }

def suggest_department(ticket_id, ticket_description):
    error = validate_input(ticket_id, ticket_description)
    if error:
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

    training_descriptions = [item['description'] for item in training_data]
    training_departments = [item['department'] for item in training_data]

    X = vectorize_descriptions(training_descriptions, ticket_description)
    cluster_labels, clusterer = perform_clustering(X)
    cluster_to_department = map_clusters_to_departments(cluster_labels, training_departments)
    suggested_department, confidence_score = get_suggestion(cluster_labels, cluster_to_department, clusterer)
    department = fetch_department(suggested_department)
    if not department:
        suggested_department = "Unknown"

    response_data = format_response(department, suggested_department, confidence_score)
    save_ai_response(ticket, ticket_description, suggested_department, confidence_score)
    return response_data, 200
