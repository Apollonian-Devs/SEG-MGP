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

def get_department_head(department_id):
    officer = Officer.objects.filter(department_id=department_id, is_department_head=True).first()
    return officer.user if officer else None


def is_chief_officer(user):
    """
    Checks if a user is a Chief Officer (department head).
    """
    return Officer.objects.filter(user=user, is_department_head=True).exists()



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

