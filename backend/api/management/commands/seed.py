from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Department, Officer, Ticket, TicketMessage, Notification, TicketStatusHistory
from faker import Faker
from datetime import timedelta
from api.helpers.ticket_status_history_helpers import (create_ticket_status_history_object, changeTicketStatus)
from .seeder_info import department_fixtures,student_fixtures,officer_fixtures,chief_officer_fixtures,admin_fixtures,ticket_fixtures,ticket_message_fixtures,notification_fixtures ,ticket_templates_by_department, conversation_templates
import random
import django.utils.timezone as timezone



class Command(BaseCommand):

    DEFAULT_PASSWORD = '1234'

    def __init__(self):
        super().__init__()  
        self.faker = Faker('en_GB')

    def handle(self, *args, **options):
        self.stdout.write("Seeding the database...")

        self.seed_departments()  
        self.seed_users()  
        self.map_officers_by_department()
        self.seed_tickets_notifications_and_messages()

        self.stdout.write("Database seeding complete!")


    def seed_tickets_notifications_and_messages(self):
        fixed_ticket_map = self.seed_tickets()
        self.seed_random_ticket_messages(fixed_ticket_map)  
        self.seed_notifications(fixed_ticket_map)
        random_ticket_map = self.seed_random_tickets()  
        self.seed_ticket_messages(random_ticket_map)  
        self.seed_random_notifications(random_ticket_map)

    def seed_departments(self):
        self.stdout.write("Seeding departments...")
        for department_data in department_fixtures:
            Department.objects.get_or_create(name=department_data['name'], defaults={'description': department_data['description']})
            print("Department "+ department_data['name'] + " created")
        self.stdout.write("Departments seeded.")
    
    def seed_department_heads(self):
        """
        Generate a department head for each deparment
        """
        self.stdout.write("Seeding department head officers...")
        for department in Department.objects.all():
            self.seed_random_user(
                is_staff=True,
                is_superuser=False,
                is_department_head=True,
                department=department
            )
        self.stdout.write("Department head officers seeded.")

    def seed_officers(self):
        """Determine the number of officers per department and call generate_officers."""
        self.stdout.write("Seeding regular officers...")
        for department in Department.objects.all():
            r = random.random()
            if r < 0.4:
                num_officers = random.randint(1,4)
            elif r < 0.8:
                num_officers = random.randint(5,8)
            else:
                num_officers = random.randint(9,10)

            self.generate_officers(department, num_officers)
        self.stdout.write("Regular officers seeded.")

    def generate_officers(self, department, num_officers):
        """Generate a given number of officers for a specific department."""
        for _ in range(num_officers):
            self.seed_random_user(
                is_staff=True,
                is_superuser=False,
                is_department_head=False,
                department=department
            )

    def map_officers_by_department(self):
        """Creates a dictionary mapping department names to lists of officers."""
        self.officers_by_department = {}
        for officer in Officer.objects.all():
            dept_name = officer.department.name
            if dept_name not in self.officers_by_department:
                self.officers_by_department[dept_name] = []
            self.officers_by_department[dept_name].append(officer)

        self.stdout.write("Mapped officers to departments.")

    def generate_students(self):
        """Randomly generate 200 students"""
        self.students = []  # Store students for later use
        for _ in range(200):
            student = self.seed_random_user(is_staff=False, is_superuser=False)
            self.students.append(student)

        self.stdout.write("200 random students seeded.")
   
    def seed_users(self):
        self.stdout.write("Seeding users...")
        self.generate_user_fixtures()
        self.seed_department_heads()
        self.seed_officers()
        self.generate_students()

        self.stdout.write("Users seeded.")


    def generate_user_fixtures(self):
        for student in student_fixtures:
            self.create_user(student)

        for officer in officer_fixtures:
            self.create_user(officer)
            
        for chief_officer in chief_officer_fixtures:
            self.create_user(chief_officer)

        for admin in admin_fixtures:
            self.create_user(admin)

    def create_user(self, data):
        user = self.create_base_user(data)

        if self.is_officer(data):
            self.assign_officer_department(user, data)

        return user


    def create_base_user(self, data):
        """Create a User with base fields."""
        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=Command.DEFAULT_PASSWORD,
            first_name=data["first_name"],
            last_name=data["last_name"],
            is_superuser=data["is_superuser"],
            is_staff=data["is_staff"],
        )
        return user


    def is_officer(self, data):
        """Check if user is an officer (staff but not superuser)."""
        return data.get("is_staff") and not data.get("is_superuser")


    def assign_officer_department(self, user, data):
        """Assign an officer to a department if valid."""
        department_name = data.get("department")
        if not department_name:
            self.stdout.write(self.style.WARNING(f"No department provided for officer '{user.username}'."))
            return
        department = Department.objects.filter(name=department_name).first()
        if not department:
            self.stdout.write(self.style.ERROR(f"Department '{department_name}' not found for officer '{user.username}'."))
            return
        Officer.objects.get_or_create(
            user=user,
            defaults={
                "department": department,
                "is_department_head": data.get("is_department_head", False),
            },
        )
        self.stdout.write(f"Officer '{user.username}' assigned to department: {department.name}.")

    
    def seed_random_user(self, is_staff=False, is_superuser=False, is_department_head=False, department=None):
        """
        Creates a User with the specified role and, if applicable, an Officer linked to a department.
        """
        first_name = self.faker.first_name()
        last_name = self.faker.last_name()
        username = self.create_username(first_name, last_name)
        email = self.create_email(first_name, last_name)

        # Create User
        user = User.objects.create_user(
            username=username,
            email=email,
            password=self.DEFAULT_PASSWORD,
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff,
            is_superuser=is_superuser
        )

        # If the user is staff, create an Officer entry
        if is_staff and department:
            Officer.objects.create(
                user=user,
                department=department,
                is_department_head=is_department_head
            )
        self.stdout.write(f"Created User: {user.username} ({'Staff' if is_staff else 'Student'})")

        return user  # Return the created user object for further use if needed

 

    def seed_tickets(self):
        """
        Seed the tickets using the ticket_fixtures data.
        """
        self.stdout.write("Seeding tickets...")
        ticket_map = {}  # To store ticket objects by subject for linking messages
        for ticket_data in ticket_fixtures:
            created_by = User.objects.get(username=ticket_data['created_by'])
            assigned_to = User.objects.get(username=ticket_data['assigned_to']) if ticket_data['assigned_to'] else None

            ticket, created = Ticket.objects.get_or_create(
                subject=ticket_data['subject'],
                defaults={
                    'description': ticket_data['description'],
                    'created_by': created_by,
                    'assigned_to': assigned_to,
                    'status': ticket_data['status'],
                    'priority': ticket_data['priority'],
                }
            )
            ticket_map[ticket_data['subject']] = ticket
            if created:
                self.stdout.write(f"Ticket '{ticket.subject}' created.")
            else:
                self.stdout.write(f"Ticket '{ticket.subject}' already exists.")
        self.stdout.write("Tickets seeded.")
        return ticket_map

    def seed_ticket_messages(self, ticket_map):
        """
        Seed the ticket messages using the ticket_message_fixtures data.
        """
        self.stdout.write("Seeding ticket messages...")
        for ticket_msg_data in ticket_message_fixtures:
            ticket_subject = ticket_msg_data['ticket_subject']
            ticket = ticket_map.get(ticket_subject)
            if not ticket:
                self.stdout.write(self.style.ERROR(f"Ticket with subject '{ticket_subject}' not found. Skipping messages."))
                continue

            for message_data in ticket_msg_data['messages']:
                sender = User.objects.get(username=message_data['sender'])
                TicketMessage.objects.create(
                    ticket=ticket,
                    sender_profile=sender,
                    message_body=message_data['body'],
                    is_internal=message_data['is_internal'],
                )
                self.stdout.write(f"Message for ticket '{ticket.subject}' added.")
        self.stdout.write("Ticket messages seeded.")

    def seed_random_tickets(self):
        """Seed tickets per department and return a ticket map."""
        self.stdout.write("Seeding random tickets...")

        ticket_map = {}  # Store ticket objects by subject

        for department_name in ticket_templates_by_department.keys():
            department = Department.objects.get(name=department_name)
            generated_tickets = self.generate_tickets_for_department(department)

            # Add generated tickets to ticket_map
            for ticket in generated_tickets:
                ticket_map[ticket.subject] = ticket

        self.stdout.write("Tickets seeded.")
        return ticket_map  # Return the ticket map


    def generate_tickets_for_department(self, department):
        officers = self.officers_by_department.get(department.name, [])
        department_head = Officer.objects.filter(department=department, is_department_head=True).first()
        admin = User.objects.filter(is_superuser=True).first()
        templates = ticket_templates_by_department.get(department.name, [])
        generated_tickets = []
        for template in templates[:10]:
            ticket = self.create_ticket_from_template(template, department, officers, department_head, admin)
            generated_tickets.append(ticket)

        return generated_tickets
    
    def create_ticket_from_template(self, template, department, officers, department_head, admin):
        created_by = random.choice(User.objects.filter(is_staff=False))
        assigned_to = (
            department_head.user if department_head and random.random() < 0.1
            else random.choice(officers).user if officers else None
        )
        is_overdue = random.random() < 0.1
        due_date = (
            timezone.datetime(2024, 2, 26, tzinfo=timezone.get_current_timezone())
            if is_overdue else timezone.now() + timedelta(days=9)
        )
        ticket = Ticket.objects.create(
            subject=template["subject"],
            description=template["description"],
            created_by=created_by,
            assigned_to=assigned_to,
            status="Open",
            priority=template["priority"],
            due_date=due_date,
            is_overdue=is_overdue
        )
        self._handle_ticket_status_history(ticket, created_by, assigned_to, admin)
        assigned_name = assigned_to.username if assigned_to else "Unassigned"
        self.stdout.write(
            f"Created Ticket: {ticket.subject} (Dept: {department.name}, Officer: {assigned_name}, Overdue: {is_overdue})")
        return ticket
    
    def _handle_ticket_status_history(self, ticket, created_by, assigned_to, admin):
        # First entry: ticket created by student
        create_ticket_status_history_object(
            ticket=ticket,
            old_status=None,
            new_status="Open",
            changed_by_profile=created_by,
            notes="Ticket created by student.")
        # Second entry: ticket assigned (and status changed)
        if assigned_to:
            changeTicketStatus(ticket, admin)

    def seed_random_ticket_messages(self, ticket_map):
        """Seed messages for all tickets."""
        self.stdout.write("Seeding random ticket messages...")

        for ticket in ticket_map.values():
            self.generate_messages_for_ticket(ticket)

        self.stdout.write("Random ticket messages seeded.")

    def generate_messages_for_ticket(self, ticket):
        """Generate a random conversation for a given ticket."""
        message_template = random.choice(conversation_templates)
        student = ticket.created_by  # Ticket creator (Student)
        officer = ticket.assigned_to  # Assigned officer (can be None)

        for message in message_template:
            sender = student if message["sender_type"] == "student" else officer
            if sender is None:
                continue
            TicketMessage.objects.create(
                ticket=ticket,
                sender_profile=sender,
                message_body=message["text"],
                is_internal=(message["sender_type"] == "officer" and random.random() < 0.2)  # 20% chance of being internal
            )

        self.stdout.write(f"Messages added for Ticket: {ticket.subject}")

    def seed_notifications(self, ticket_map):
        """
        Seed notifications for users based on notification_fixtures data.
        """
        for notification_data in notification_fixtures:
            user = User.objects.get(username=notification_data['user_profile'])
            ticket = ticket_map.get(notification_data['ticket_subject'])

            if not ticket:
                self.stdout.write(self.style.ERROR(f"Ticket with subject '{notification_data['ticket_subject']}' not found. Skipping notification."))
                continue

            Notification.objects.create(
                user_profile=user,
                ticket=ticket,
                message=notification_data['message'],
            )

            self.stdout.write(f"Notification for user '{user.username}' on ticket '{ticket.subject}' added.")
        self.stdout.write("Notifications seeded.")
    
    def seed_random_notifications(self, ticket_map):
        """Generate a notification for every ticket, based on assigned user type."""
        self.stdout.write("Seeding random notifications...")

        for ticket in ticket_map.values():
            self.generate_notification_for_ticket(ticket)

        self.stdout.write("Random notifications seeded.")

    def generate_notification_for_ticket(self, ticket):
        """Generate a notification for a given ticket based on the assigned user type."""
        user = ticket.assigned_to or ticket.created_by  # If no officer, notify creator

        # Determine notification message
        if user.is_staff:  # Assigned to an officer or department head
            officer = Officer.objects.filter(user=user).first()
            if officer and officer.is_department_head:
                message = "You need to assign a new ticket."
            else:
                message = "You need to respond to a new ticket."
        else:  # Student case
            message = "Your ticket has been sent."

        # Create the Notification
        Notification.objects.create(
            user_profile=user,
            ticket=ticket,
            message=message,
        )

        self.stdout.write(f"Notification added for '{user.username}' on Ticket: {ticket.subject}")


    def create_username(self, first_name, last_name):
        base_username = '@' + first_name.lower() + last_name.lower()
        username = base_username
        counter = 1
        # Loop until a unique username is found
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        return username



    def create_email(self,first_name, last_name):
        """Generate emails for users."""
        return first_name + '.' + last_name + '@example.org'