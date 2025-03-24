from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from api.models import Ticket,STATUS_CHOICES, PRIORITY_CHOICES
from .notification_helpers import notify_user_of_change_to_ticket
from .ticket_status_history_helpers import create_ticket_status_history_object
from django.utils import timezone

STATUS_AWAITING_STUDENT = STATUS_CHOICES[2][0]  


def changeTicketPriority(ticket, user):
    """
    If user is an admin or an officer, then change the ticket priority.
    It cycles the priority like a circular queue: Low → Medium → High → Low.
    If user is a student, raise PermissionDenied.
    """
    if not user.is_staff:
        raise PermissionDenied("Only officers or admins can change ticket priority.")

    old_priority = ticket.priority

    if old_priority is None:
        ticket.priority = PRIORITY_CHOICES[0][0]
    else:
        priority_list = [p[0] for p in PRIORITY_CHOICES]
        current_index = priority_list.index(old_priority)
        ticket.priority = priority_list[(current_index + 1) % len(priority_list)]  # Circular shift

    ticket.save()
    create_ticket_status_history_object(ticket, ticket.status, ticket.status, user, 
                                        (f"Priority changed from {old_priority} to {ticket.priority}"))



def get_overdue_tickets(user):
    """
    Updates the is_overdue field for all tickets (only those with a due_date)
    and returns a queryset of overdue tickets based on the user's role.
    """

    if user is None:
        raise PermissionDenied("Invalid type of user")


    now = timezone.now()
    
    # Update tickets that have a due_date set:
    # Mark tickets with a due_date less than now as overdue
    Ticket.objects.filter(due_date__isnull=False, due_date__lt=now).update(is_overdue=True)
    # Mark tickets with a due_date set that are not overdue as not overdue
    Ticket.objects.filter(due_date__isnull=False, due_date__gte=now).update(is_overdue=False)

    # Retrieve tickets that are overdue (due_date is not null by definition)
    queryset = Ticket.objects.filter(is_overdue=True)
    
    if user.is_staff:
        return queryset.filter(assigned_to=user)
    else:
        return queryset.filter(created_by=user)


def changeTicketDueDate(ticket, user, new_due_date):
    """
    If user is an admin or an officer, then change ticket due date
    if user is a student, then raise permission denied
    Also notify the ticket owner (student) that a new due date is set.
    """
    if user.is_staff:
        if new_due_date <= timezone.now():
            raise ValueError("You cannot change the due date to be in the past.") 
        ticket.due_date = new_due_date
        ticket.save()

        if ticket.status != STATUS_AWAITING_STUDENT:
            create_ticket_status_history_object(ticket, ticket.status, STATUS_AWAITING_STUDENT, user, 
                                                (f"Due date changed to {new_due_date} and Ticket Status is Awaiting Student"))

            # Change the ticket status.
            ticket.status = STATUS_AWAITING_STUDENT
            ticket.save()


        notify_user_of_change_to_ticket(
            (
                f"Due date has been set/updated to {new_due_date.strftime('%d/%m/%Y, %H:%M:%S')} "
                f"by {user.username}."
            ),
            ticket.created_by,
            ticket,
            'Your due date of the ticket'
        )

        return ticket
    
    else:
        raise PermissionDenied("Only officers or admins can change ticket due date.")