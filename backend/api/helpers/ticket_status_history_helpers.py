from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from api.models import Ticket, TicketStatusHistory, STATUS_CHOICES

STATUS_OPEN = STATUS_CHOICES[0][0]  
STATUS_IN_PROGRESS = STATUS_CHOICES[1][0]  
STATUS_AWAITING_STUDENT = STATUS_CHOICES[2][0]  
STATUS_CLOSED = STATUS_CHOICES[3][0] 

def create_ticket_status_history_object(ticket, old_status, new_status, changed_by_profile, notes):
    """
    Creates a ticket status history record.

    @param ticket: Related ticket object
    @param old_status: Previous status value
    @param new_status: New status value
    @param changed_by_profile: User changing the status
    @param notes: Additional change notes
    @return: Created TicketStatusHistory object
    """
    return TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=old_status,
        new_status=new_status,
        changed_by_profile=changed_by_profile,
        notes=notes
    )

def get_ticket_history(admin_user, ticket):
    """
    Retrieves status history for a ticket (admin only).

    @param admin_user: User requesting history (must be superuser)
    @param ticket: Ticket to get history for
    @return: QuerySet of status changes ordered by date
    @raises: PermissionDenied for non-admins
    @raises: ValueError for invalid ticket
    """
    if not admin_user.is_superuser:
        raise PermissionDenied("Only admins can view ticket history.")
    if ticket is None:
        raise ValueError("Invalid ticket provided.")

    return TicketStatusHistory.objects.filter(ticket=ticket).order_by("-changed_at")

def changeTicketStatus(ticket, user):
    """
    Cycles ticket status (Open → In Progress → Awaiting Student → Closed → Open).

    @param ticket: Ticket to modify
    @param user: User requesting change (must be staff)
    @raises: PermissionDenied for non-staff users
    """
    if not user.is_staff:
        raise PermissionDenied("Only officers or admins can change ticket status.")

    old_status = ticket.status
    status_list = [s[0] for s in STATUS_CHOICES]

    # Circular status shift
    if old_status is None:
        ticket.status = status_list[0]
    else:
        current_index = status_list.index(old_status)
        ticket.status = status_list[(current_index + 1) % len(status_list)]

    ticket.save()
    create_ticket_status_history_object(ticket, old_status, ticket.status, user, 
                                      f"Status changed from {old_status} to {ticket.status}")