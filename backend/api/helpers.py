from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from django.db.models import Count
from api.models import (
    Ticket, TicketMessage, TicketStatusHistory, TicketRedirect, 
    TicketAttachment, Notification, Officer, STATUS_CHOICES, PRIORITY_CHOICES
)
import random



def send_query(student_user, subject, description, message_body, attachments=None):
    """
    Creates a new ticket for 'student' user.
    Also creates an initial TicketMessage and handles file attachments.
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

    if attachments:
        for att in attachments:
            if "file_name" in att and "file_path" in att:
                TicketAttachment.objects.create(
                    message=msg,
                    file_name=att["file_name"],
                    file_path=att["file_path"],
                    mime_type=att.get("mime_type", "application/octet-stream"),
                )

    TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=None,
        new_status="Open",
        changed_by_profile=student_user,
        notes="Ticket created by student."
    )

    return ticket


def send_response(sender_profile, ticket, message_body, is_internal=False, attachments=None):
    """
    Allows a user (student or staff) to add a new message to an existing ticket.
    Optionally mark it as an internal note (is_internal=True) and attach files.
    Also triggers a notification for the "other side".

    :param sender_user: The User object sending the message.
    :param ticket: The existing Ticket object to which we're responding.
    :param message_body: The text content of the new message.
    :param is_internal: Whether this message is internal (visible only to staff).
    :param attachments: A list of dictionaries, each containing:
         - file_name: Name of the file.
         - file_path: A placeholder URL (e.g., "https://your-storage-service.com/uploads/<filename>").
         - mime_type: MIME type of the file (defaults to "application/octet-stream" if not provided).
    :raises PermissionDenied: if the user is None or the ticket is closed.
    :return: The newly created TicketMessage object.
    """
    if sender_profile is None:
        raise PermissionDenied("No authenticated user to send a response.")
    if ticket is None:
        raise ValidationError("Invalid ticket provided.")
    if ticket.status == "Closed":
        raise ValidationError("Cannot respond to a closed ticket.")

    # Create the new TicketMessage.
    new_msg = TicketMessage.objects.create(
        ticket=ticket,
        sender_profile=sender_profile,
        message_body=message_body,
        is_internal=is_internal
    )

    # Process attachments if provided.
    #-----written by chatgpt ------
    if attachments:
        for att in attachments:
            TicketAttachment.objects.create(
                message=new_msg,
                file_name=att["file_name"],
                file_path=att["file_path"],
                mime_type=att.get("mime_type", "application/octet-stream")
            )

    # Update the ticket's updated_at timestamp.
    ticket.updated_at = timezone.now()
    ticket.save()

    # Create a Notification for the other party.
    if sender_profile.is_staff:
        Notification.objects.create(
            user_profile=ticket.created_by,
            ticket=ticket,
            message=f"Staff responded to Ticket #{ticket.id}"
        )
    else:
        if ticket.assigned_to is not None:
            Notification.objects.create(
                user_profile=ticket.assigned_to,
                ticket=ticket,
                message=f"Student replied on Ticket #{ticket.id}"
            )

    return new_msg



def validate_redirection(from_user, to_user):
    if not from_user.is_staff:
        raise PermissionDenied("Only officers or admins can redirect tickets.")
    if from_user == to_user:
        raise ValidationError("Redirection failed: Cannot redirect the ticket to the same user.")






def redirect_query(ticket, from_user, to_user, reason=None, new_status=None, new_priority=None):
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

    print(details)
    return details
#---------------------------------------------------------


def get_message_history(ticket):
    """
    Return a list of all messages for a given ticket sorted by creation date ascending.
    Only include messages where is_internal is False.
    """
    messages = TicketMessage.objects.filter(ticket=ticket, is_internal=False).order_by("created_at")

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
        })
    return msg_list



def get_ticket_history(admin_user, ticket):
    """
    Return list of all status changes for a given ticket sorted by change date descending.
    """
    if not admin_user.is_staff and not admin_user.is_superuser:
        raise PermissionDenied("Only officers or admins can view ticket history.")

    history = TicketStatusHistory.objects.filter(ticket=ticket).order_by("-changed_at")


    return history

    

def get_notifications(user, limit=10):
    """
    Retrieve 'limit' number of unread latest notifications for the user.
    """
    return Notification.objects.filter(
        user_profile=user,
        read_status=False
    ).order_by("-created_at")[:limit]


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


     # Both Admin and Officers get only their assigned tickets
    if user.is_superuser or user.is_staff:
        tickets = Ticket.objects.filter(assigned_to=user)
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
            "due_date": ticket.due_date,
            "is_overdue": ticket.is_overdue,
            "assigned_to": ticket.assigned_to.username if ticket.assigned_to else None
        }
        for ticket in tickets
    ]


def get_officers_same_department(user):
    try:
        officer = Officer.objects.get(user=user)
        return Officer.objects.filter(department=officer.department).exclude(user=user)
    except Officer.DoesNotExist:
        return Officer.objects.none()




def changeTicketPriority(ticket, user):
    '''
    if user is an admin or an officer, then change ticket prirority
    it gets the current priority of the ticket and changes it to the next priority in the list like a circular queue
    if user is a student, then raise permission denied
    '''

    old_priority = ticket.priority
    if user.is_staff:
        if ticket.priority == None:
            ticket.priority = PRIORITY_CHOICES[0][0]
        else:
            for i in range(len(PRIORITY_CHOICES)):
                if ticket.priority == PRIORITY_CHOICES[i][0]:
                    ticket.priority = PRIORITY_CHOICES[(i+1)%len(PRIORITY_CHOICES)][0]
                    break
        ticket.save()

        TicketStatusHistory.objects.create(
            ticket=ticket,
            old_status=ticket.status,
            new_status=ticket.status,
            changed_by_profile=user,
            notes=f"Priority changed from {old_priority} to {ticket.priority}"
        )

    else:
        raise PermissionDenied("Only officers or admins can change ticket priority.")
    

def changeTicketStatus(ticket, user):
    '''
    if user is an admin or an officer, then change ticket status
    it gets the current status of the ticket and changes it to the next status in the list like a circular queue
    if user is a student, then raise permission denied
    '''

    old_status = ticket.status

    if user.is_staff:
        if ticket.status == None:
            ticket.status = STATUS_CHOICES[0][0]
        else:
            for i in range(len(STATUS_CHOICES)):
                if ticket.status == STATUS_CHOICES[i][0]:
                    ticket.status = STATUS_CHOICES[(i+1)%len(STATUS_CHOICES)][0]
                    break
        ticket.save()

        TicketStatusHistory.objects.create(
            ticket=ticket,
            old_status=old_status,
            new_status=ticket.status,
            changed_by_profile=user,
            notes="Status changed via changeTicketStatus()"
        )
        
    else:
        raise PermissionDenied("Only officers or admins can change ticket status.")
    

def get_overdue_tickets(user):
    """Returns queryset of overdue tickets based on user role."""
    
    queryset = Ticket.objects.filter(due_date__lt=timezone.now()) 

    if user.is_superuser or user.is_staff:
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
        if new_due_date < timezone.now():
            raise ValueError("You cannot change the due date to be in the past.") 
        ticket.due_date = new_due_date
        ticket.save()

        # Notify the student who created the ticket
        Notification.objects.create(
            user_profile=ticket.created_by,
            ticket=ticket,
            message=(
                f"Due date has been set/updated to {new_due_date.strftime('%Y-%m-%d %H:%M:%S')} "
                f"by {user.username}."
            ),
        )


        TicketStatusHistory.objects.create(
            ticket=ticket,
            old_status=ticket.status,
            new_status=ticket.status,
            changed_by_profile=user,
            notes=f"Due date changed to {new_due_date}"
        )


        return ticket
    

    else:
        raise PermissionDenied("Only officers or admins can change ticket due date.")


def get_random_department():
    """
    get all the officers with is_department_head as True and their corresponding departments
    return a random department from that list. you use import random for this
    """
    department_heads = Officer.objects.filter(is_department_head=True)
    department = random.choice(department_heads).department
    return department

def get_department_head(department_id):
    try:
        officer = Officer.objects.filter(department_id=department_id, is_department_head=True).first()
        return officer.user if officer else None
    except Officer.DoesNotExist:
        return None

def is_chief_officer(user):
    """
    Checks if a user is a Chief Officer (department head).
    """
    return Officer.objects.filter(user=user, is_department_head=True).exists()






