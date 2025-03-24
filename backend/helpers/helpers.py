from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from django.db.models import Count
from api.models import (
    Ticket, TicketMessage, TicketStatusHistory, TicketRedirect, 
    TicketAttachment, Notification, Officer, STATUS_CHOICES, PRIORITY_CHOICES, AIResponse
)
from api.MessagesGroupingAI import *







STATUS_OPEN = STATUS_CHOICES[0][0]  
STATUS_IN_PROGRESS = STATUS_CHOICES[1][0]  
STATUS_AWAITING_STUDENT = STATUS_CHOICES[2][0]  
STATUS_CLOSED = STATUS_CHOICES[3][0] 


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


def create_ticket_status_history_object(ticket, old_status, new_status, changed_by_profile, notes):
    status = TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=old_status,
        new_status=new_status,
        changed_by_profile=changed_by_profile,
        notes=notes
    )

    return status

def create_ticket_object(subject, description, created_by, status, priority, due_date):
    ticket = Ticket(
        subject=subject,
        description=description,
        created_by=created_by,
        status=status,
        priority=priority,
        due_date=due_date
    )

    ticket.save()

    return ticket


    return redirect






def get_ticket_history(admin_user, ticket):
    """
    Return a list of all status changes for a given ticket sorted by change date descending.
    """
    if not admin_user.is_superuser:
        raise PermissionDenied("Only admins can view ticket history.")
    
    if ticket is None:
        raise ValueError("Invalid ticket provided.")  # Changed to ValueError

    history = TicketStatusHistory.objects.filter(ticket=ticket).order_by("-changed_at")

    return history





def get_ticket_path(admin_user, ticket):
    """
    Return list of all path changes for a given ticket, ordered in descending order.
    """
    if not admin_user.is_superuser:
        raise PermissionDenied("Only admins can view ticket path.")

    if ticket is None:
        raise ValueError("Invalid ticket provided.")

    path = TicketRedirect.objects.filter(ticket=ticket).order_by('-id')  

    return path



def get_tickets_for_user(user):
    """
    Retrieve all tickets associated with a user.
    If the user is a student, return tickets they created.
    If the user is an officer, return tickets assigned to them.
    If the user is an admin, return all tickets.
    """


    if user.is_staff:
        tickets = Ticket.objects.filter(assigned_to=user)
    else:
        tickets = Ticket.objects.filter(created_by=user) 

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

    # TicketStatusHistory.objects.create(
    #     ticket=ticket,
    #     old_status=ticket.status,
    #     new_status=ticket.status, 
    #     changed_by_profile=user,
    #     notes=f"Priority changed from {old_priority} to {ticket.priority}"
    # )
    create_ticket_status_history_object(ticket, ticket.status, ticket.status, user, 
                                        (f"Priority changed from {old_priority} to {ticket.priority}"))


def changeTicketStatus(ticket, user):
    """
    If user is an admin or an officer, change the ticket status.
    It cycles through statuses like a circular queue: 
    Open → In Progress → Awaiting Student → Closed → Open.
    If user is a student, raise PermissionDenied.
    """
    if not user.is_staff:
        raise PermissionDenied("Only officers or admins can change ticket status.")

    old_status = ticket.status


    status_list = [s[0] for s in STATUS_CHOICES]
    if old_status is None:
        ticket.status = status_list[0]
    else:
        current_index = status_list.index(old_status)
        ticket.status = status_list[(current_index + 1) % len(status_list)] 

    ticket.save()

    # TicketStatusHistory.objects.create(
    #     ticket=ticket,
    #     old_status=old_status,
    #     new_status=ticket.status,
    #     changed_by_profile=user,
    #     notes=f"Status changed from {old_status} to {ticket.status}"
    # )  
    create_ticket_status_history_object(ticket, old_status, ticket.status, user, 
                                        (f"Status changed from {old_status} to {ticket.status}"))



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
            # Create a status history record for the change.
            # TicketStatusHistory.objects.create(
            #     ticket=ticket,
            #     old_status=ticket.status,
            #     new_status=STATUS_AWAITING_STUDENT,
            #     changed_by_profile=user,
            #     notes=f"Due date changed to {new_due_date} and Ticket Status is Awaiting Student"
            # )
            create_ticket_status_history_object(ticket, ticket.status, STATUS_AWAITING_STUDENT, user, 
                                                (f"Due date changed to {new_due_date} and Ticket Status is Awaiting Student"))

            # Change the ticket status.
            ticket.status = STATUS_AWAITING_STUDENT
            ticket.save()

        # msg = (
        #         f"Due date has been set/updated to {new_due_date.strftime('%d/%m/%Y, %H:%M:%S')} "
        #         f"by {user.username}."
        #     )

        # create_notification(ticket.created_by, ticket, msg)
        # send_email(ticket.created_by, 'Your due date of the ticket', (msg),)

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


def get_department_head(department_id):
    officer = Officer.objects.filter(department_id=department_id, is_department_head=True).first()
    return officer.user if officer else None


def is_chief_officer(user):
    """
    Checks if a user is a Chief Officer (department head).
    """
    return Officer.objects.filter(user=user, is_department_head=True).exists()

'''
class AIResponse(models.Model):
     ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
     prompt_text = models.TextField(null=True, blank=True)
     response_text = models.TextField(null=True, blank=True)
     confidence = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
     created_at = models.DateTimeField(auto_now_add=True)

     verified_by_profile = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
     verification_status = models.CharField(max_length=50, null=True, blank=True)

     class Meta:
         constraints = [
             models.CheckConstraint(
                 check=(
                     Q(confidence__isnull=True)
                     | (Q(confidence__gte=0) & Q(confidence__lte=100))
                 ),
                 name='ai_confidence_range_0_100'
             )
         ]
    
     def __str__(self):
        return f"AI Response #{self.id} for Ticket #{self.ticket.id}"
'''


def get_tags(user):
    if not user.is_superuser:
        raise PermissionDenied("Only Admins can get ticket clustering suggestions.")

    tickets = Ticket.objects.filter(assigned_to=user)

    if len(tickets) < 2:
        #print(f"❌ DEBUG: Not enough tickets for clustering (found {len(tickets)})")
        return {"error": "Not enough tickets available for clustering. Need at least 2."}

    lst = [f"Title: {ticket.subject}, description: {ticket.description}" for ticket in tickets]
    
    try:
        clusters, probabilities = MessageGroupAI(lst)
    except Exception as e:
        return {"error": f"Clustering error: {str(e)}"}

    ticket_cluster_map = {}

    for index, ticket in enumerate(tickets):
        cluster_id = int(clusters[index])
        ticket_cluster_map[ticket.id] = cluster_id

        AIResponse.objects.create(
            ticket=ticket,
            response_text=str(cluster_id),
            confidence=str(probabilities[index]),
            verified_by_profile=user,
            verification_status="Verified"
        )

    print(f"✅ DEBUG: Successfully assigned clusters: {ticket_cluster_map}")
    return ticket_cluster_map


