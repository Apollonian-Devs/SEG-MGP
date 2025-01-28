from django.core.management.base import BaseCommand, CommandError
# from random import randint, random, choice, sample
from django.contrib.auth.models import User
from api.models import Department, Officer

student_fixtures = [
    {'username': 'johndoe', 'email': 'john.doe@example.org', 'first_name': 'John', 'last_name': 'Doe', 'is_staff': False, 'is_superuser': False},
    {'username': 'janedoe', 'email': 'jane.doe@example.org', 'first_name': 'Jane', 'last_name': 'Doe', 'is_staff': False, 'is_superuser': False},
    {'username': 'charlie', 'email': 'charlie.johnson@example.org', 'first_name': 'Charlie', 'last_name': 'Johnson', 'is_staff': False,  'is_superuser': False},
]

officer_fixtures = [
    {'username': 'officer1', 'email': 'officer1@example.org', 'first_name': 'Officer', 'last_name': 'One', 'is_staff': True, 'is_superuser': False, 'departments': ['IT', 'Finance'] },
    {'username': 'officer2', 'email': 'officer2@example.org', 'first_name': 'Officer', 'last_name': 'Two', 'is_staff': True, 'is_superuser': False, 'departments': ['HR', 'Finance'] },
    {'username': 'officer3', 'email': 'officer3@example.org', 'first_name': 'Officer', 'last_name': 'Three', 'is_staff': True, 'is_superuser': False, 'departments': ['IT', 'HR'] },
]

admin_fixtures = [
    {'username': 'admin1', 'email': 'admin1@example.org', 'first_name': 'Admin', 'last_name': 'One', 'is_staff': True, 'is_superuser': True},
]

department_fixtures = [
    {'name': 'IT', 'description': 'Information Technology'},
    {'name': 'HR', 'description': 'Human Resources'},
    {'name': 'Finance', 'description': 'Finance Department'},
]

class Command(BaseCommand):

    DEFAULT_PASSWORD = '1234'

    def handle(self, *args, **options):
        self.stdout.write("Seeding the database...")

        self.seed_departments()
        self.seed_users()

        self.stdout.write("Database seeding complete!")

    def seed_departments(self):

        self.stdout.write("Department seeding complete.")

    def seed_users(self):
        self.generate_user_fixtures()
        # self.generate_random_users()

    def seed_departments(self):
        for department in department_fixtures:
            self.create_department(department)

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

        if data['is_staff']:
            department_objects = Department.objects.filter(name__in=data['departments'])
            officer = Officer.objects.create(user=user)
            officer.departments.set(department_objects)
            officer.save()

    def create_department(self, data):
        Department.objects.create(
            name=data['name'],
            description=data['description']
        )