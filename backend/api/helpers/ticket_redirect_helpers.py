from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from api.models import Ticket, STATUS_CHOICES, TicketRedirect
from .notification_helpers import notify_user_of_change_to_ticket

STATUS_CLOSED = STATUS_CHOICES[3][0]

def create_ticket_redirect_object(ticket, from_profile, to_profile):
    """
    Creates a ticket redirect record.

    @param ticket: Ticket being redirected
    @param from_profile: User redirecting the ticket
    @param to_profile: User receiving the ticket
    @return: Created TicketRedirect object
    """
    return TicketRedirect.objects.create(
        ticket=ticket,
        from_profile=from_profile,
        to_profile=to_profile
    )

def validate_redirection(from_user, to_user):
    """
    Validates ticket redirection parameters.

    @param from_user: User initiating redirect
    @param to_user: User receiving redirect
    @raises: PermissionDenied for invalid users or non-staff
    @raises: ValidationError for self-redirect
    """
    if from_user is None or to_user is None:
        raise PermissionDenied("Invalid redirection: Users cannot be None.")
    
    if not (from_user.is_staff):
        raise PermissionDenied("Only officers or admins can redirect tickets.")

    if from_user == to_user:
        raise ValidationError("Redirection failed: Cannot redirect the ticket to the same user.")

def redirect_query(ticket, from_user, to_user):
    """
    Redirects a ticket to another user and notifies them.

    @param ticket: Ticket to redirect
    @param from_user: User initiating redirect (must be staff)
    @param to_user: User receiving ticket
    @return: Modified ticket object
    @raises: ValidationError for invalid/closed tickets
    """
    if ticket is None:
        raise ValidationError("Invalid ticket provided.")

    if ticket.status == STATUS_CLOSED:
        raise ValidationError("Redirection failed: Closed tickets cannot be redirected.")

    validate_redirection(from_user, to_user)

    # Update ticket assignment
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