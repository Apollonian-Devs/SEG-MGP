from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from api.models import Ticket, STATUS_CHOICES, TicketRedirect
from .notification_helpers import notify_user_of_change_to_ticket

STATUS_CLOSED = STATUS_CHOICES[3][0]

def create_ticket_redirect_object(ticket, from_profile, to_profile):
    redirect = TicketRedirect.objects.create(
        ticket=ticket,
        from_profile=from_profile,
        to_profile=to_profile
    )
    
    return redirect

def validate_redirection(from_user, to_user):

    if from_user is None or to_user is None:
        raise PermissionDenied("Invalid redirection: Users cannot be None.")
    
    if not (from_user.is_staff):
        raise PermissionDenied("Only officers or admins can redirect tickets.")

    if from_user == to_user:
        raise ValidationError("Redirection failed: Cannot redirect the ticket to the same user.")


def redirect_query(ticket, from_user, to_user):
    """
    Redirect ticket' from one user to another.
    Officers can redirect within the same department
    admins can redirect across departments.
    """

    if ticket is None:
        raise ValidationError("Invalid ticket provided.")

    if ticket.status == STATUS_CLOSED:
        raise ValidationError("Redirection failed: Closed tickets cannot be redirected.")
    
    

    validate_redirection(from_user, to_user)

    ticket.assigned_to = to_user
    ticket.updated_at = timezone.now()
    ticket.save()

    create_ticket_redirect_object(ticket, from_user, to_user)

    notify_user_of_change_to_ticket(
        f"Ticket #{ticket.id} has been redirected to you by {from_user.username}.",
        to_user,
        ticket,
        "Redirection of ticket"
    )

    return ticket
