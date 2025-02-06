from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from django.db.models import Count
from api.models import (
    Ticket, TicketMessage, TicketStatusHistory, TicketRedirect, 
    TicketAttachment, Notification
)

def send_query(student_user, subject, description, message_body, attachments=None):
    """
    Creates a new ticket for 'student' user.
    creates an initial TicketMessage with the student's message.
    Optionally attaches files if is provided.
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


    
    #---------------------------------------------------------
    #written by gpt
    # 'att' should be a dictionary with file_name, file_path, and mime_type
    if attachments:
        for att in attachments:
            if not att.get("file_name") or not att.get("file_path"):
                raise ValidationError("Attachment must have a valid file_name and file_path.")
            TicketAttachment.objects.create(
                message=msg,
                file_name=att["file_name"],
                file_path=att["file_path"],
                mime_type=att.get("mime_type", "application/octet-stream"),
            )
    #---------------------------------------------------------




    TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=None,
        new_status="Open",
        changed_by_profile=student_user,
        notes="Ticket created by student."
    )

    return ticket



def validate_redirection(from_user, to_user):
    if not from_user.is_staff:
        raise PermissionDenied("Only officers or admins can redirect tickets.")
    if not from_user.is_superuser and from_user.officer.department != to_user.officer.department:
        raise ValidationError("Officers can only redirect tickets within their department.")
    if from_user == to_user:
        raise ValidationError("Redirection failed: Cannot redirect the ticket to the same user.")




def redirect_query(ticket, from_user, to_user, new_status=None, new_priority=None, reason=None):
    """
    Redirect ticket' from one user to another.
    Officers can redirect within the same department
    admins can redirect across departments.
    """


    if ticket.status == "Closed":
        raise ValidationError("Redirection failed: Closed tickets cannot be redirected.")
    
    validate_redirection(from_user, to_user)


    old_status = ticket.status

    ticket.assigned_to = to_user
    ticket.status = new_status or old_status
    ticket.priority = new_priority or ticket.priority
    ticket.updated_at = timezone.now()
    ticket.save()

    TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=old_status,
        new_status=ticket.status,
        changed_by_profile=from_user,
        notes=f"Redirected by {from_user.username}. {reason or ''}",
    )

    TicketRedirect.objects.create(
        ticket=ticket,
        from_profile=from_user,
        to_profile=to_user,
        reason=reason,
        redirected_at=timezone.now(),
    )

    Notification.objects.create(
        user_profile=to_user,
        ticket=ticket,
        message=f"Ticket #{ticket.id} has been redirected to you by {from_user.username}.",
    )


    return ticket





#---------------------------------------------------------
#written by gpt
def view_ticket_details(ticket):
    """
    This returns dictionary containing the key details about ticket.
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
#---------------------------------------------------------

def get_message_history(ticket):
    """
    Return a list of all messages for a given ticket sorted by creation date ascending
    and it distinguishes between Student, Officer, and Admin roles.
    """
    messages = TicketMessage.objects.filter(ticket=ticket).order_by("created_at")

    msg_list = []
    for m in messages:
        # Determine the sender role
        if not m.sender_profile.is_staff:
            sender_role = "Student"
        elif m.sender_profile.is_superuser:
            sender_role = "Admin"
        else:
            sender_role = "Officer"
        
        msg_list.append({
            "message_id": m.id,
            "sender": m.sender_profile.username,
            "sender_role": sender_role,
            "body": m.message_body,
            "created_at": m.created_at,
            "is_internal": m.is_internal,
        })
    return msg_list





def get_ticket_history(admin_user, ticket):
    """
    Return list of all status changes for a given ticket sorted by change date descending.
    """
    if not admin_user.is_staff and not admin_user.is_superuser:
        raise PermissionDenied("Only officers or admins can view ticket history.")

    history = TicketStatusHistory.objects.filter(ticket=ticket).order_by("-changed_at")

    #---------------------------------------------------------
    #helped by gpt
    hist_list = []
    for h in history:
        hist_list.append({
            "old_status": h.old_status,
            "new_status": h.new_status,
            "changed_by": h.changed_by_profile.username,
            "changed_at": h.changed_at,
            "notes": h.notes,
        })
    return hist_list
    #---------------------------------------------------------
    


def get_notifications(user, limit=10):
    """
    Retrieve 'limit' number of unread latest notifications for the user.
    """
    return Notification.objects.filter(
        user_profile=user,
        read_status=False
    ).order_by("-created_at")[:limit]



def mark_notification_as_read(notification):
    """
    Mark single notification as read.
    """
    notification.read_status = True
    notification.save()
def mark_id_as_read(target):
    """
    Mark notification of id as read.
    """
    result = Notification.objects.filter(
        id=target,
    ).first()
    result.read_status = True
    result.save()

def mark_all_notifications_as_read(user):
    """
    Mark all unread notifications for the user as read 
    """
    Notification.objects.filter(user_profile=user, read_status=False).update(
        read_status=True,
        updated_at=timezone.now()
    )



def get_tickets_for_user(user):
    """
    Retrieve all tickets associated with a user.
    If the user is a student, return tickets they created.
    If the user is an officer, return tickets assigned to them.
    If the user is an admin, return all tickets.
    """
    if user.is_superuser:
        tickets = Ticket.objects.all()  # Admin gets all tickets
    elif user.is_staff:
        tickets = Ticket.objects.filter(assigned_to=user)  # Officers get assigned tickets
    else:
        tickets = Ticket.objects.filter(created_by=user)  # Students get their own tickets

    return [
        {
            "id": ticket.id,
            "subject": ticket.subject,
            "description": ticket.description,
            "status": ticket.status,
            "priority": ticket.priority,
            "created_at": ticket.created_at,
            "updated_at": ticket.updated_at,
            "assigned_to": ticket.assigned_to.username if ticket.assigned_to else None
        }
        for ticket in tickets
    ]








