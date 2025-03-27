from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from api.models import Ticket,STATUS_CHOICES, PRIORITY_CHOICES
from .notification_helpers import notify_user_of_change_to_ticket
from .ticket_status_history_helpers import create_ticket_status_history_object
from django.utils import timezone

STATUS_AWAITING_STUDENT = STATUS_CHOICES[2][0]  

def changeTicketPriority(ticket, user):
    """
    Cycles ticket priority (Low → Medium → High → Low) for staff users only.

    @param ticket: Ticket object to modify
    @param user: User requesting the change (must be staff)
    @raises: PermissionDenied if user is not staff
    """
    if not user.is_staff:
        raise PermissionDenied("Only officers or admins can change ticket priority.")

    old_priority = ticket.priority

    # Circular priority shift
    if old_priority is None:
        ticket.priority = PRIORITY_CHOICES[0][0]
    else:
        priority_list = [p[0] for p in PRIORITY_CHOICES]
        current_index = priority_list.index(old_priority)
        ticket.priority = priority_list[(current_index + 1) % len(priority_list)]

    ticket.save()
    create_ticket_status_history_object(ticket, ticket.status, ticket.status, user, 
                                      f"Priority changed from {old_priority} to {ticket.priority}")

def get_overdue_tickets(user):
    """
    Updates overdue status for tickets and returns user's overdue tickets.

    @param user: User requesting the data (must not be None)
    @return: QuerySet of overdue tickets filtered by user role
    @raises: PermissionDenied if user is None
    """
    if user is None:
        raise PermissionDenied("Invalid type of user")

    now = timezone.now()
    
    # Update overdue status for all tickets with due dates
    Ticket.objects.filter(due_date__isnull=False, due_date__lt=now).update(is_overdue=True)
    Ticket.objects.filter(due_date__isnull=False, due_date__gte=now).update(is_overdue=False)

    # Return filtered by user role
    queryset = Ticket.objects.filter(is_overdue=True)
    return queryset.filter(assigned_to=user) if user.is_staff else queryset.filter(created_by=user)

def changeTicketDueDate(ticket, user, new_due_date):
    """
    Updates ticket due date for staff users and notifies student.

    @param ticket: Ticket object to modify
    @param user: User requesting the change (must be staff)
    @param new_due_date: New due date to set
    @return: Modified ticket object
    @raises: PermissionDenied if user is not staff
    @raises: ValueError if date is in past
    """
    if not user.is_staff:
        raise PermissionDenied("Only officers or admins can change ticket due date.")
    if new_due_date <= timezone.now():
        raise ValueError("You cannot change the due date to be in the past.") 

    ticket.due_date = new_due_date
    ticket.save()

    # Update status if needed
    if ticket.status != STATUS_AWAITING_STUDENT:
        create_ticket_status_history_object(ticket, ticket.status, STATUS_AWAITING_STUDENT, user, 
                                         f"Due date changed to {new_due_date} and Ticket Status is Awaiting Student")
        ticket.status = STATUS_AWAITING_STUDENT
        ticket.save()

    # Notify student
    notify_user_of_change_to_ticket(
        f"Due date has been set/updated to {new_due_date.strftime('%d/%m/%Y, %H:%M:%S')} by {user.username}.",
        ticket.created_by,
        ticket,
        'Your due date of the ticket'
    )

    return ticket