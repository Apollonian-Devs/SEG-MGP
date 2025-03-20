import os
import json
from sklearn.feature_extraction.text import TfidfVectorizer
import hdbscan
from api.models import Ticket, Department, AIResponse
from api.serializers import DepartmentSerializer
from django.conf import settings

def suggest_department(ticket_id, ticket_description):
    if not ticket_id or not ticket_description:
        return {"error": "Ticket ID and description are required."}, 400

    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return {"error": "Ticket not found."}, 404

    departments = Department.objects.all()
    department_names = [dept.name for dept in departments]

    if not department_names:
        return {"error": "No departments found in the system."}, 500

    training_data_path = os.path.join(settings.BASE_DIR, 'training_data.json')
    try:
        with open(training_data_path, 'r') as f:
            training_data = json.load(f)
    except FileNotFoundError:
        return {"error": "Training data file not found."}, 500

    training_descriptions = [item['description'] for item in training_data]
    training_departments = [item['department'] for item in training_data]

    vectorizer = TfidfVectorizer()
    all_descriptions = training_descriptions + [ticket_description]
    X = vectorizer.fit_transform(all_descriptions)

    clusterer = hdbscan.HDBSCAN(min_cluster_size=2, min_samples=1, metric='euclidean')
    cluster_labels = clusterer.fit_predict(X.toarray())

    cluster_to_department = {}
    for i, label in enumerate(cluster_labels[:-1]):
        if label != -1:
            cluster_to_department[label] = training_departments[i]

    new_ticket_cluster = cluster_labels[-1]
    confidence_score = clusterer.probabilities_[-1] if clusterer.probabilities_ is not None else 0.0
    suggested_department = "Unknown"
    department = None

    if new_ticket_cluster != -1:
        suggested_department = cluster_to_department.get(new_ticket_cluster, "Unknown")

        try:
            department = Department.objects.get(name=suggested_department)
        except Department.DoesNotExist:
            suggested_department = "Unknown"

    response_data = {
        "suggested_department": suggested_department,
        "confidence_score": float(confidence_score)
    }

    if department:
        response_data["suggested_department"] = DepartmentSerializer(department).data

    ai_response = AIResponse(
        ticket=ticket,
        prompt_text=ticket_description,
        response_text=suggested_department,
        confidence=confidence_score * 100,
        verification_status="Pending"
    )
    ai_response.save()

    return response_data, 200