from django.contrib.auth.models import User
from api.models import Ticket, Officer, Department, TicketRedirect
from django.core.exceptions import ValidationError, PermissionDenied

def get_tickets_for_user(user):
    """
    Retrieves tickets based on user role.

    @param user: User requesting tickets
    @return: List of ticket dictionaries filtered by role
    """
    tickets = Ticket.objects.filter(assigned_to=user) if user.is_staff else Ticket.objects.filter(created_by=user)
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
            "closed_at": ticket.closed_at,
            "assigned_to": ticket.assigned_to.username if ticket.assigned_to else None
        }
        for ticket in tickets
    ]

def get_officers_same_department(user): 
    """
    Gets officers in the same department as user.

    @param user: User to find department mates for
    @return: QuerySet of officers in same department
    """
    officer = Officer.objects.filter(user=user).first()
    return Officer.objects.filter(department=officer.department).exclude(user=user) if officer else Officer.objects.none()

def get_department_head(department_id): 
    """
    Finds department head for a department.

    @param department_id: Department ID to search
    @return: User object of department head or None
    """
    officer = Officer.objects.filter(department_id=department_id, is_department_head=True).first()
    return officer.user if officer else None

def is_chief_officer(user):
    """
    Checks if user is a department head.

    @param user: User to check
    @return: Boolean indicating chief officer status
    """
    return Officer.objects.filter(user=user, is_department_head=True).exists()

def create_ticket_object(subject, description, created_by, status, priority, due_date):
    """
    Creates and saves a new ticket.

    @param subject: Ticket subject
    @param description: Ticket description
    @param created_by: User creating ticket
    @param status: Initial status
    @param priority: Initial priority
    @param due_date: Optional due date
    @return: Created Ticket object
    """
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

def get_ticket_path(admin_user, ticket):
    """
    Gets redirect history for a ticket (admin only).

    @param admin_user: User requesting path (must be superuser)
    @param ticket: Ticket to get history for
    @return: QuerySet of redirects ordered by ID
    @raises: PermissionDenied for non-admins
    @raises: ValueError for invalid ticket
    """
    if not admin_user.is_superuser:
        raise PermissionDenied("Only admins can view ticket path.")
    if ticket is None:
        raise ValueError("Invalid ticket provided.")

    return TicketRedirect.objects.filter(ticket=ticket).order_by('-id')