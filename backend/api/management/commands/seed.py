from django.core.management.base import BaseCommand

# from random import randint, random, choice, sample

from django.contrib.auth.models import User

from api.models import Department, Officer, Ticket, TicketMessage, Notification

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

    {'name': 'IT', 'description': 'Information Technology'},

    {'name': 'HR', 'description': 'Human Resources'},

    {'name': 'Finance', 'description': 'Finance Department'},

    {'name': 'Wellbeing', 'description': 'Wellbeing Department'},

    {'name': 'Informatics', 'description': 'Informatics Department'},

    {'name': 'Classics', 'description': 'Department of Classics'},

    {'name': 'KBS', 'description': "King's Business School"},

    {'name': 'Maintenance', 'description': "Buildings maintenance department"},

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

        'user_profile': '@johndoe',

        'ticket_subject': 'Check My Fees',

        'message': 'An officer has responded to your ticket about fees.',

    },

    {

        'user_profile': '@johndoe',

        'ticket_subject': 'Dorm Maintenance Issue',

        'message': 'Maintenance is addressing the leak in your dorm.',

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



    def handle(self, *args, **options):

        self.stdout.write("Seeding the database...")





        self.seed_departments()

        self.seed_users()

        x = self.seed_tickets()

        self.seed_ticket_messages(x)

        self.seed_notifications(x)

        self.stdout.write("Database seeding complete!")



    def seed_departments(self):

        self.stdout.write("Seeding departments...")

        for department_data in department_fixtures:

            Department.objects.get_or_create(name=department_data['name'], defaults={'description': department_data['description']})

            print("Department "+ department_data['name'] + " created")

        self.stdout.write("Departments seeded.")



    def seed_users(self):

        self.stdout.write("Seeding users...")

        self.generate_user_fixtures()

        # self.generate_random_users()

        self.stdout.write("Users seeded.")





    def generate_user_fixtures(self):

        for student in student_fixtures:

            self.create_user(student)



        for officer in officer_fixtures:

            self.create_user(officer)



        for admin in admin_fixtures:

            self.create_user(admin)





    def generate_random_users(self):

        print("User seeding complete.")



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