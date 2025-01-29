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
