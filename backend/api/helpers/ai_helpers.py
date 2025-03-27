from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from api.models import Ticket, AIResponse
from api.MessagesGroupingAI import *

def get_tags(user):
    """  
    Gets ticket clustering suggestions for admin users only.

    @param user: User object requesting the data. Must be superuser.
    @return: Dictionary with ticket-cluster mapping or error message.
    """
    if not user.is_superuser:
        raise PermissionDenied("Only Admins can get ticket clustering suggestions.")

    tickets = Ticket.objects.filter(assigned_to=user)

    if len(tickets) < 2:
        return {"error": "Not enough tickets available for clustering. Need at least 2."}

    # Prepare ticket data for clustering
    lst = [f"Title: {ticket.subject}, description: {ticket.description}" for ticket in tickets]
    
    try:
        clusters, probabilities = MessageGroupAI(lst)
    except Exception as e:
        return {"error": f"Clustering error: {str(e)}"}

    # Map tickets to their clusters
    ticket_cluster_map = {}
    for index, ticket in enumerate(tickets):
        cluster_id = int(clusters[index])
        ticket_cluster_map[ticket.id] = cluster_id

        # Save AI response for each ticket
        AIResponse.objects.create(
            ticket=ticket,
            response_text=str(cluster_id),
            confidence=str(probabilities[index]),
            verified_by_profile=user,
            verification_status="Verified"
        )

    return ticket_cluster_map