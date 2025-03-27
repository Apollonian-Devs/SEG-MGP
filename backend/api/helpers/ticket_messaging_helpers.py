from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from api.models import Ticket, TicketAttachment, TicketMessage
from .utility_helpers import create_ticket_object
from .notification_helpers import notify_user_of_change_to_ticket
from .ticket_status_history_helpers import create_ticket_status_history_object, STATUS_OPEN, STATUS_IN_PROGRESS, STATUS_AWAITING_STUDENT, STATUS_CLOSED
from django.utils import timezone


def handle_attachments(message, attachments):
    """Handles file attachments for a given message."""
    for att in attachments:
        if "file_name" in att and "file_path" in att:
            TicketAttachment.objects.create(
                message=message,
                file_name=att["file_name"],
                file_path=att["file_path"],
                mime_type=att.get("mime_type", "application/octet-stream"),
            )


def create_ticket_message_object(ticket, sender_profile, message_body, is_internal):
    msg = TicketMessage.objects.create(
        ticket=ticket,
        sender_profile=sender_profile,
        message_body=message_body,
        is_internal=is_internal
    )

    return msg


def send_query(student_user, subject, description, message_body, attachments=None):
    """
    Creates a new ticket for 'student' user.
    Also creates an initial TicketMessage and handles file attachments.
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
    if ticket.status == STATUS_CLOSED:
        raise ValidationError("Cannot respond to a closed ticket.")

    new_msg = create_ticket_message_object(ticket, sender_profile, message_body, is_internal)

    # Process attachments if provided.
    #-----written by chatgpt ------
    if attachments:
        handle_attachments(new_msg, attachments)
        
    # Update the ticket's updated_at timestamp.
    ticket.updated_at = timezone.now()
    ticket.save()

    

    let_expected_status = STATUS_AWAITING_STUDENT if sender_profile.is_staff else STATUS_OPEN

    if ticket.status != let_expected_status:
        old_status = ticket.status
        ticket.status = let_expected_status
        ticket.save()
        create_ticket_status_history_object(ticket, old_status, ticket.status, sender_profile, 
                                            ("Staff responded to the ticket." if sender_profile.is_staff else "Student responded to the ticket."))


    # Create a Notification for the other party.
    if sender_profile.is_staff:
        notify_user_of_change_to_ticket(
            f"Staff replied to Ticket #{ticket.id}",
            ticket.created_by,
            ticket,
            "Message Recieved"
        )
    else:
        if ticket.assigned_to is not None:
            notify_user_of_change_to_ticket(
                f"Student replied to Ticket #{ticket.id}",
                ticket.assigned_to,
                ticket, 
                "Message Recieved"
            )

    return new_msg


def get_message_history(ticket):
    """
    Return a list of all messages for a given ticket sorted by creation date ascending.
    Only include messages where is_internal is False.
    Each message includes its attachments, if any.
    """
    if ticket is None:
        raise ValueError("Ticket is None")
    
    messages = TicketMessage.objects.filter(ticket=ticket, is_internal=False).order_by("created_at")

    msg_list = []
    for m in messages:
        # Determine the sender role
        if m.sender_profile.is_superuser:
            sender_role = "Admin"
        elif m.sender_profile.is_staff:
            sender_role = "Officer"
        else:
            sender_role = "Student"

        # Fetch attachments for this message
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
            "attachments": attachment_list,  # ✅ Attachments included here
        })

    return msg_list
