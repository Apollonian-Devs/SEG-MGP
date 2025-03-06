from django.core.management.base import BaseCommand, CommandError
# from random import randint, random, choice, sample
from django.contrib.auth.models import User
from api.models import Department, Officer, Ticket, TicketMessage, Notification, TicketStatusHistory
from api.management.ticketTemplates import ticket_templates_by_department, conversation_templates
import random
from faker import Faker
from random import randint
from datetime import timedelta
import django.utils.timezone as timezone

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

chief_officer_fixtures = [

    {'username': '@chiefofficer1', 'email': 'chiefofficer1@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'One', 'is_staff': True, 'is_superuser': False, 'is_department_head': True,'department': 'IT'},

    {'username': '@chiefofficer2', 'email': 'chiefofficer2@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Two', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'HR'},

    {'username': '@chiefofficer3', 'email': 'chiefofficer3@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Three', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Finance'},

    {'username': '@chiefofficer4', 'email': 'chiefofficer4@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Four', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Wellbeing'},
    
    {'username': '@chiefofficer5', 'email': 'chiefofficer5@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Five', 'is_staff': True, 'is_superuser': False, 'is_department_head': True,'department': 'Maintenance'},

    {'username': '@chiefofficer6', 'email': 'chiefofficer6@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Six', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Housing'},

    {'username': '@chiefofficer7', 'email': 'chiefofficer7@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Seven', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Admissions'},

    {'username': '@chiefofficer8', 'email': 'chiefofficer8@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Eight', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Library Services'},
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
        super().__init__()  
        self.faker = Faker('en_GB')

    def handle(self, *args, **options):
        self.stdout.write("Seeding the database...")

        self.seed_departments()  
        self.seed_users()  
        self.map_officers_by_department()
        self.seed_ticket_notification_messages()

        self.stdout.write("Database seeding complete!")


    def seed_ticket_notification_messages(self):
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
                    
                    officer, created = Officer.objects.get_or_create(
                        
                        user=user,
                        
                        defaults={
                            'department': department_object,
                            'is_department_head': data.get('is_department_head', False)  # Ensure department head status is set
                        }
                        
                    )
                    
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
        """Generate 10 tickets for a given department and return the created tickets."""
        officers = self.officers_by_department.get(department.name, [])
        department_head = Officer.objects.filter(department=department, is_department_head=True).first()
        admin = User.objects.filter(is_superuser=True).first()  # Get the first admin user

        generated_tickets = []  # Store tickets

        for ticket_template in ticket_templates_by_department[department.name]:
            created_by = random.choice(User.objects.filter(is_staff=False))
            assigned_to = (
                department_head.user if department_head and random.random() < 0.1
                else random.choice(officers).user if officers else None
            )


            # Determine if ticket is overdue (10% chance)
            is_overdue = random.random() < 0.1
            due_date = (
                timezone.datetime(2024, 2, 26, tzinfo=timezone.get_current_timezone()) if is_overdue
                else timezone.now() + timedelta(days=9)
            )

            # Create the Ticket
            ticket = Ticket.objects.create(
                subject=ticket_template["subject"],
                description=ticket_template["description"],
                created_by=created_by,
                assigned_to=assigned_to,
                status="Open",
                priority=ticket_template["priority"],
                due_date=due_date,
                is_overdue=is_overdue
            )

            generated_tickets.append(ticket)  # Add to the list of created tickets

            # First TicketStatusHistory Entry - Ticket Created by Student
            TicketStatusHistory.objects.create(
                ticket=ticket,
                old_status=None,
                new_status="Open",
                changed_by_profile=created_by,
                notes="Ticket created by student."
            )

            # Second TicketStatusHistory Entry - Ticket Assigned to Officer/Department Head
            if assigned_to:
                TicketStatusHistory.objects.create(
                    ticket=ticket,
                    old_status="Open",
                    new_status="Open",
                    changed_by_profile=admin,
                    notes=f"Ticket assigned to {assigned_to.username}."
                )

            assigned_officer_name = assigned_to.username if assigned_to else "Unassigned"
            self.stdout.write(f"Created Ticket: {ticket.subject} (Dept: {department.name}, Officer: {assigned_officer_name}, Overdue: {is_overdue})")

        return generated_tickets  # Return created tickets



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