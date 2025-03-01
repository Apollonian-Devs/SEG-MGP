from django.core.management.base import BaseCommand, CommandError
# from random import randint, random, choice, sample
from django.contrib.auth.models import User
from api.models import Department, Officer, Ticket, TicketMessage, Notification
from management.ticketTemplates import ticket_templates_by_department, conversation_templates
import random
from faker import Faker
from random import randint

student_fixtures = [
    {'username': '@johndoe', 'email': 'john.doe@example.org', 'first_name': 'John', 'last_name': 'Doe', 'is_staff': False, 'is_superuser': False},
    {'username': '@janedoe', 'email': 'jane.doe@example.org', 'first_name': 'Jane', 'last_name': 'Doe', 'is_staff': False, 'is_superuser': False},
    {'username': '@charlie', 'email': 'charlie.johnson@example.org', 'first_name': 'Charlie', 'last_name': 'Johnson', 'is_staff': False, 'is_superuser': False},
]

officer_fixtures = [
    {'username': '@officer1', 'email': 'officer1@example.org', 'first_name': 'Officer', 'last_name': 'One', 'is_staff': True, 'is_superuser': False, 'department': 'IT'},
    {'username': '@officer2', 'email': 'officer2@example.org', 'first_name': 'Officer', 'last_name': 'Two', 'is_staff': True, 'is_superuser': False, 'department': 'HR'},
    {'username': '@officer3', 'email': 'officer3@example.org', 'first_name': 'Officer', 'last_name': 'Three', 'is_staff': True, 'is_superuser': False, 'department': 'Finance'},
    {'username': '@officer4', 'email': 'officer4@example.org', 'first_name': 'Officer', 'last_name': 'Four', 'is_staff': True, 'is_superuser': False, 'department': 'IT'},
]


admin_fixtures = [
    {'username': '@admin1', 'email': 'admin1@example.org', 'first_name': 'Admin', 'last_name': 'One', 'is_staff': True, 'is_superuser': True},
]

department_fixtures = [
    # King's College London Faculties
    {'name': 'Faculty of Arts & Humanities', 'description': 'Covers literature, history, philosophy, and creative industries.'},
    {'name': 'Faculty of Social Science & Public Policy', 'description': 'Focuses on global affairs, politics, and public policy.'},
    {'name': 'Faculty of Natural, Mathematical & Engineering Sciences', 'description': 'Includes mathematics, physics, informatics, and engineering.'},
    {'name': 'Faculty of Life Sciences & Medicine', 'description': 'Covers medical biosciences, cardiovascular studies, and pharmaceutical sciences.'},
    {'name': "King's Business School", 'description': 'Focuses on accounting, finance, marketing, and business strategy.'},
    {'name': 'The Dickson Poon School of Law', 'description': 'Specializes in legal studies and research.'},
    {'name': 'Faculty of Dentistry, Oral & Craniofacial Sciences', 'description': 'Covers dental sciences and oral healthcare.'},
    {'name': 'Florence Nightingale Faculty of Nursing, Midwifery & Palliative Care', 'description': 'Focuses on nursing, midwifery, and palliative care.'},
    {'name': 'Institute of Psychiatry, Psychology & Neuroscience', 'description': 'Researches mental health, neuroscience, and addiction studies.'},

    # Administrative & Service Departments
    {'name': 'IT', 'description': 'Handles technical support, student portals, and system security.'},
    {'name': 'HR', 'description': 'Manages staff recruitment, payroll, and work policies.'},
    {'name': 'Finance', 'description': 'Handles tuition fees, scholarships, and financial aid.'},
    {'name': 'Wellbeing', 'description': 'Provides student counseling and wellbeing services.'},
    {'name': 'Maintenance', 'description': 'Manages building maintenance, plumbing, and electrical repairs.'},
    {'name': 'Housing', 'description': 'Oversees student accommodations, dorm assignments, and rent payments.'},
    {'name': 'Admissions', 'description': 'Manages student applications, enrollment, and transfers.'},
    {'name': 'Library Services', 'description': 'Oversees book loans, research databases, and study spaces.'},
    {'name': 'Student Affairs', 'description': 'Handles extracurricular activities, student unions, and student complaints.'},
]


ticket_fixtures = [
    {
        'subject': 'Lost Student ID',
        'description': 'I lost my ID card near the library. Need help getting a replacement.',
        'created_by': '@johndoe',   
        'assigned_to': '@officer1', 
        'status': 'Open',
        'priority': 'High',
    },
    {
        'subject': 'Check My Fees',
        'description': 'Not sure how much I owe in tuition fees this semester.',
        'created_by': '@janedoe',
        'assigned_to': '@officer2',
        'status': 'Open',
        'priority': 'Medium',
    },
    {
        'subject': 'Dorm Maintenance Issue',
        'description': 'There is a water leak in my dorm room sink.',
        'created_by': '@charlie',
        'assigned_to': '@officer2',
        'status': 'In Progress',
        'priority': 'High',
    },
]



ticket_message_fixtures = [
    {
        'ticket_subject': 'Lost Student ID',
        'messages': [
            {'sender': '@johndoe', 'body': 'Hello, I lost my ID. What should I do?', 'is_internal': False},
            {'sender': '@officer1', 'body': 'You can visit the card office for a replacement.', 'is_internal': False},
        ]
    },
    {
        'ticket_subject': 'Check My Fees',
        'messages': [
            {'sender': '@janedoe', 'body': 'Could you clarify my outstanding fees?', 'is_internal': False},
            {'sender': '@officer2', 'body': 'Please check your student portal for updated fee details.', 'is_internal': False},
        ]
    },
    {
        'ticket_subject': 'Dorm Maintenance Issue',
        'messages': [
            {'sender': '@charlie', 'body': 'Hello, I am having leakage issues in my dorm room. I live on Room 101 on the Waterloo accommodation. There are mold and moisture patches forming on the walls. Please send someone to check immediately!', 'is_internal': False},
            {'sender': '@charlie', 'body': 'My dorm sink is leaking. Any updates?', 'is_internal': False},
            {'sender': '@officer2', 'body': 'Maintenance has been notified and will check soon.', 'is_internal': False},
            {'sender': '@officer2', 'body': 'Internal note: Leak might need urgent plumbing services.', 'is_internal': True},
        ]
    },
]



notification_fixtures = [
    {
        'user_profile': '@johndoe',
        'ticket_subject': 'Lost Student ID',
        'message': 'Your ticket regarding your lost ID has been updated.',
    },
    {
        'user_profile': '@janedoe',
        'ticket_subject': 'Check My Fees',
        'message': 'An officer has responded to your ticket about fees.',
    },
    {
        'user_profile': '@charlie',
        'ticket_subject': 'Dorm Maintenance Issue',
        'message': 'Maintenance is addressing the leak in your dorm.',
    },
    {
        'user_profile': '@officer1',
        'ticket_subject': 'Lost Student ID',
        'message': 'The student has responded to the lost ID ticket.',
    },
    {
        'user_profile': '@officer2',
        'ticket_subject': 'Dorm Maintenance Issue',
        'message': 'Urgent plumbing services may be required for the dorm issue.',
    },
]





class Command(BaseCommand):

    DEFAULT_PASSWORD = '1234'

    def __init__(self):
        self.faker = Faker('en_GB')

    def handle(self, *args, **options):
        self.stdout.write("Seeding the database...")


        self.seed_departments()
        self.seed_users()
        x = self.seed_tickets()
        self.seed_ticket_messages(x)

        self.stdout.write("Database seeding complete!")

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
            # Determine number of officers 
            num_officers = random.choices(range(1, 11), weights=[40, 40, 20], k=1)[0]
            # Generate the officers
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

    
    def seed_users(self):
<<<<<<< HEAD
=======

        self.stdout.write("Seeding users...")

>>>>>>> 620339da2e847f0595ee031b411335ea68581783
        self.generate_user_fixtures()
        self.seed_department_heads()
        # self.generate_random_users()

        self.stdout.write("Users seeded.")


    def generate_user_fixtures(self):
        for student in student_fixtures:
            self.create_user(student)

        for officer in officer_fixtures:
            self.create_user(officer)

        for admin in admin_fixtures:
            self.create_user(admin)

    def create_user(self, data):
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=Command.DEFAULT_PASSWORD,
            first_name=data['first_name'],
            last_name=data['last_name'],
            is_superuser=data['is_superuser'],
            is_staff=data['is_staff'],
        )

        # Assign a single department to officers
        if data['is_staff'] and not data['is_superuser']:
            if 'department' in data:
                department_object = Department.objects.filter(name=data['department']).first()
                if department_object:
                    officer, created = Officer.objects.get_or_create(user=user, defaults={'department': department_object})
                    self.stdout.write(f"Officer '{user.username}' assigned to department: {department_object.name}.")
                else:
                    self.stdout.write(self.style.ERROR(f"Department '{data['department']}' not found for officer '{user.username}'."))   

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
            role = "Department Head" if is_department_head else "Officer"
            self.stdout.write(f"Created {role} for '{department.name}': {user.username}")
        else:
            self.stdout.write(f"Created Student: {user.username}")

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
        """Seed tickets per department."""
        self.stdout.write("Seeding tickets...")

        for department_name in ticket_templates_by_department.keys():
            department = Department.objects.get(name=department_name)
            self.generate_tickets_for_department(department)

        self.stdout.write("Tickets seeded.")

    def generate_tickets_for_department(self, department):
        """Generate 10 tickets for a given department."""
        officers = self.officers_by_department.get(department.name, [])
        department_head = Officer.objects.filter(department=department, is_department_head=True).first()

        for ticket_template in ticket_templates_by_department[department.name]:
            created_by = random.choice(self.students)

            assigned_to = (
                department_head if department_head and random.random() < 0.1
                else random.choice(officers) if officers else None
            )

            ticket = Ticket.objects.create(
                subject=ticket_template["subject"],
                description=ticket_template["description"],
                created_by=created_by,
                assigned_to=assigned_to,
                status="Open",  # Default status
                priority=ticket_template["priority"],  # Use predefined priority
            )

            assigned_officer_name = assigned_to.user.username if assigned_to else "Unassigned"
            self.stdout.write(f"Created Ticket: {ticket.subject} (Dept: {department.name}, Officer: {assigned_officer_name})")

    def seed_ticket_messages(self, ticket_map):
        """Seed messages for all tickets."""
        self.stdout.write("Seeding ticket messages...")

        for ticket in ticket_map.values():
            self.generate_messages_for_ticket(ticket)

        self.stdout.write("Ticket messages seeded.")

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
        self.stdout.write("Seeding notifications...")

        for ticket in ticket_map.values():
            self.generate_notification_for_ticket(ticket)

        self.stdout.write("Notifications seeded.")

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


    def create_username(first_name, last_name):
        """Generate usernames for users."""
        return '@' + first_name.lower() + last_name.lower()


    def create_email(first_name, last_name):
        """Generate emails for users."""
        return first_name + '.' + last_name + '@example.org'
