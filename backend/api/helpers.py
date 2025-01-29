from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from django.db.models import Count
from api.models import (
    Ticket, TicketMessage, TicketStatusHistory, TicketRedirect, 
    TicketAttachment, AIResponse, Notification, Officer, Department
)

def send_query(student_user, subject, description, message_body, attachments=None):
    """
    Create a new ticket on behalf of a 'student' user.
    Then create an initial TicketMessage with the student's message.
    Optionally attach files if 'attachments' is provided.
    """

    if student_user is None or student_user.is_staff or student_user.is_superuser:
        raise PermissionDenied("Only student users can create tickets.")

    ticket = Ticket(
        subject=subject,
        description=description,
        created_by=student_user,  
        status="Open", 
        priority=None,  
        due_date=None,   
    )
   
    ticket.save()


    msg = TicketMessage.objects.create(
        ticket=ticket,
        sender_profile=student_user,
        message_body=message_body,
        is_internal=False
    )


     # 'att' should be a dictionary with file_name, file_path, and mime_type
    if attachments:
        for att in attachments:
            TicketAttachment.objects.create(
                message=msg,
                file_name=att.get("file_name", "unknown_file"),
                file_path=att.get("file_path", ""),
                mime_type=att.get("mime_type", "application/octet-stream")
            )



    TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=None,
        new_status="Open",
        changed_by_profile=student_user,
        notes="Ticket created by student."
    )

    return ticket


def redirect_query(ticket, from_user, to_user, new_status=None, new_priority=None, reason=None):
    """
    Redirect the given 'ticket' from one user to another.
    Update the ticket's assigned_to, status, priority, and log the redirection + status history.
    """

    if not from_user.is_staff and not from_user.is_superuser:
        raise PermissionDenied("Only officers or admins can redirect tickets.")

    old_status = ticket.status

    ticket.assigned_to = to_user
    if new_status:
        ticket.status = new_status
    if new_priority:
        ticket.priority = new_priority
    ticket.updated_at = timezone.now()
    ticket.save()

    TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=old_status,
        new_status=new_status,
        changed_by_profile=from_user,
        changed_at=timezone.now(),
        notes=f"Redirect triggered. {reason or ''}"
    )

    TicketRedirect.objects.create(
        ticket=ticket,
        from_profile=from_user,
        to_profile=to_user,
        reason=reason,
        redirected_at=timezone.now()
    )

 
    Notification.objects.create(
        user_profile=to_user,
        ticket=ticket,
        message=f"You have been assigned Ticket #{ticket.id}",
    )






def view_ticket_details(ticket):
    """
    Return a dictionary or object containing key info about the given ticket.
    """
    details = {
        "ticket_id": ticket.id,
        "subject": ticket.subject,
        "description": ticket.description,
        "created_by": ticket.created_by.username,
        "assigned_to": ticket.assigned_to.username if ticket.assigned_to else None,
        "status": ticket.status,
        "priority": ticket.priority,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "closed_at": ticket.closed_at,
        "due_date": ticket.due_date,
        "is_overdue": ticket.is_overdue,
    }
    return details


def get_message_history(ticket):
    """
    Return a list of all messages for a given ticket, sorted by creation date ascending.
    """
    messages = TicketMessage.objects.filter(ticket=ticket).order_by("created_at")

    msg_list = []
    for m in messages:
        msg_list.append({
            "message_id": m.id,
            "sender": m.sender_profile.username,
            "body": m.message_body,
            "created_at": m.created_at,
            "is_internal": m.is_internal,
        })
    return msg_list

def get_notifications(user):
    """
    Retrieve unread notifications for the user, or all notifications if you prefer.
    """
    notifications = Notification.objects.filter(
        user_profile=user, 
        read_status=False).order_by("-created_at")
    
    return notifications










