



STATUS_OPEN = STATUS_CHOICES[0][0]  
STATUS_IN_PROGRESS = STATUS_CHOICES[1][0]  
STATUS_AWAITING_STUDENT = STATUS_CHOICES[2][0]  
STATUS_CLOSED = STATUS_CHOICES[3][0] 


def create_ticket_status_history_object(ticket, old_status, new_status, changed_by_profile, notes):
    status = TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=old_status,
        new_status=new_status,
        changed_by_profile=changed_by_profile,
        notes=notes
    )

    return status

def get_ticket_history(admin_user, ticket):
    """
    Return a list of all status changes for a given ticket sorted by change date descending.
    """
    if not admin_user.is_superuser:
        raise PermissionDenied("Only admins can view ticket history.")
    
    if ticket is None:
        raise ValueError("Invalid ticket provided.")  # Changed to ValueError

    history = TicketStatusHistory.objects.filter(ticket=ticket).order_by("-changed_at")

    return history

def changeTicketStatus(ticket, user):
    """
    If user is an admin or an officer, change the ticket status.
    It cycles through statuses like a circular queue: 
    Open → In Progress → Awaiting Student → Closed → Open.
    If user is a student, raise PermissionDenied.
    """
    if not user.is_staff:
        raise PermissionDenied("Only officers or admins can change ticket status.")

    old_status = ticket.status


    status_list = [s[0] for s in STATUS_CHOICES]
    if old_status is None:
        ticket.status = status_list[0]
    else:
        current_index = status_list.index(old_status)
        ticket.status = status_list[(current_index + 1) % len(status_list)] 

    ticket.save()
    create_ticket_status_history_object(ticket, old_status, ticket.status, user, 
                                        (f"Status changed from {old_status} to {ticket.status}"))


