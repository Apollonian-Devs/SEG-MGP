def get_tags(user):
    if not user.is_superuser:
        raise PermissionDenied("Only Admins can get ticket clustering suggestions.")

    tickets = Ticket.objects.filter(assigned_to=user)

    if len(tickets) < 2:
        #print(f"❌ DEBUG: Not enough tickets for clustering (found {len(tickets)})")
        return {"error": "Not enough tickets available for clustering. Need at least 2."}

    lst = [f"Title: {ticket.subject}, description: {ticket.description}" for ticket in tickets]
    
    try:
        clusters, probabilities = MessageGroupAI(lst)
    except Exception as e:
        return {"error": f"Clustering error: {str(e)}"}

    ticket_cluster_map = {}

    for index, ticket in enumerate(tickets):
        cluster_id = int(clusters[index])
        ticket_cluster_map[ticket.id] = cluster_id

        AIResponse.objects.create(
            ticket=ticket,
            response_text=str(cluster_id),
            confidence=str(probabilities[index]),
            verified_by_profile=user,
            verification_status="Verified"
        )

    print(f"✅ DEBUG: Successfully assigned clusters: {ticket_cluster_map}")
    return ticket_cluster_map


