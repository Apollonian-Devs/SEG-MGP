from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from api.models import Ticket, TicketAttachment, TicketMessage
from .utility_helpers import create_ticket_object
from .notification_helpers import notify_user_of_change_to_ticket
from .ticket_status_history_helpers import create_ticket_status_history_object, STATUS_OPEN, STATUS_IN_PROGRESS, STATUS_AWAITING_STUDENT, STATUS_CLOSED
from django.utils import timezone

def handle_attachments(message, attachments):
    """
    Creates attachment objects for a message.

    @param message: Message object to attach files to
    @param attachments: List of attachment dictionaries
    """
    for att in attachments:
        if "file_name" in att and "file_path" in att:
            TicketAttachment.objects.create(
                message=message,
                file_name=att["file_name"],
                file_path=att["file_path"],
                mime_type=att.get("mime_type", "application/octet-stream"),
            )

def create_ticket_message_object(ticket, sender_profile, message_body, is_internal):
    """
    Creates a new message object for a ticket.

    @param ticket: Related ticket object
    @param sender_profile: User sending the message
    @param message_body: Content of the message
    @param is_internal: Whether message is internal to staff
    @return: Created TicketMessage object
    """
    return TicketMessage.objects.create(
        ticket=ticket,
        sender_profile=sender_profile,
        message_body=message_body,
        is_internal=is_internal
    )

def send_query(student_user, subject, description, message_body, attachments=None):
    """
    Creates a new ticket with initial message for a student user.

    @param student_user: Student user creating the ticket
    @param subject: Ticket subject
    @param description: Ticket description
    @param message_body: Initial message content
    @param attachments: Optional list of attachments
    @return: Created Ticket object
    @raises: PermissionDenied if user is not a student
    @raises: ValueError if required fields are missing
    """
    if student_user is None or student_user.is_staff:
        raise PermissionDenied("Only student users can create tickets.")


    if not subject:
        raise ValueError("Subject is required")
    if not description:
        raise ValueError("Description is required")
    if not message_body:
        raise ValueError("Message body is required")


    ticket = create_ticket_object(subject, description, student_user, STATUS_OPEN, None, None)

    msg = create_ticket_message_object(ticket, student_user, message_body, False)

    if attachments:
        handle_attachments(msg, attachments)

    create_ticket_status_history_object(ticket, None, STATUS_OPEN, student_user, "Ticket created by student.")

    return ticket

def send_response(sender_profile, ticket, message_body, is_internal=False, attachments=None):
    """
    Adds a response to an existing ticket and updates its status.

    @param sender_profile: User sending the response
    @param ticket: Ticket being responded to
    @param message_body: Response content
    @param is_internal: Whether response is internal to staff
    @param attachments: Optional list of attachments
    @return: Created TicketMessage object
    @raises: PermissionDenied if user is invalid
    @raises: ValidationError if ticket is closed or invalid
    """
    if sender_profile is None:
        raise PermissionDenied("No authenticated user to send a response.")
    if ticket is None:
        raise ValidationError("Invalid ticket provided.")
    if ticket.status == STATUS_CLOSED:
        raise ValidationError("Cannot respond to a closed ticket.")

    new_msg = create_ticket_message_object(ticket, sender_profile, message_body, is_internal)

    if attachments:
        handle_attachments(new_msg, attachments)
        
    # Update ticket timestamp and status
    ticket.updated_at = timezone.now()
    let_expected_status = STATUS_AWAITING_STUDENT if sender_profile.is_staff else STATUS_OPEN

    if ticket.status != let_expected_status:
        old_status = ticket.status
        ticket.status = let_expected_status
        ticket.save()
        status_msg = "Staff responded" if sender_profile.is_staff else "Student responded"
        create_ticket_status_history_object(ticket, old_status, ticket.status, sender_profile, f"{status_msg} to the ticket.")

    # Notify the other party
    if sender_profile.is_staff:
        notify_user_of_change_to_ticket(
            f"Staff replied to Ticket #{ticket.id}",
            ticket.created_by,
            ticket,
            "Message Recieved"
        )
    elif ticket.assigned_to:
        notify_user_of_change_to_ticket(
            f"Student replied to Ticket #{ticket.id}",
            ticket.assigned_to,
            ticket, 
            "Message Recieved"
        )

    return new_msg

def get_message_history(ticket):
    """
    Retrieves message history for a ticket.

    @param ticket: Ticket to get history for
    @return: List of message dictionaries with attachments
    @raises: ValueError if ticket is None
    """
    if ticket is None:
        raise ValueError("Ticket is None")
    
    messages = TicketMessage.objects.filter(ticket=ticket, is_internal=False).order_by("created_at")
    msg_list = []
    
    for m in messages:
        # Determine sender role
        sender_role = "Admin" if m.sender_profile.is_superuser else "Officer" if m.sender_profile.is_staff else "Student"
        
        # Get attachments
        attachments = TicketAttachment.objects.filter(message=m)
        attachment_list = [
            {
                "file_name": a.file_name,
                "file_path": a.file_path,
                "mime_type": a.mime_type
            }
            for a in attachments
        ]
        
        msg_list.append({
            "message_id": m.id,
            "sender": m.sender_profile.username,
            "sender_role": sender_role,
            "body": m.message_body,
            "created_at": m.created_at,
            "attachments": attachment_list,
        })

    return msg_list
