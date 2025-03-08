from django.test import TestCase
from unittest.mock import patch
from django.contrib.auth.models import User
from api.models import Ticket, User, Department, Officer, TicketRedirect, TicketMessage, Notification
from api.serializers import TicketSerializer, UserSerializer, DepartmentSerializer, OfficerSerializer, TicketRedirectSerializer, TicketMessageSerializer, NotificationSerializer, ChangeTicketDateSerializer
from django.utils import timezone

class UserSerializerTestCase(TestCase):

    def test_serialization(self):

        user = User.objects.create_user(
            username='TestUsername',
            first_name='TestFirstName',
            last_name='TestLastName',
            email='TestEmail@example.com',
            password='TestPassword123'
        )
        serializer = UserSerializer(user)
        serialized_data = serializer.data


        self.assertEqual(serialized_data['username'], user.username)
        self.assertEqual(serialized_data['first_name'], user.first_name)
        self.assertEqual(serialized_data['last_name'], user.last_name)
        self.assertEqual(serialized_data['email'], user.email)
        self.assertNotIn('password', serialized_data)  # password should not be serialized
        
        
    @patch("django.contrib.auth.models.User.objects.create_user")
    def test_create_user_exception(self, mock_create_user):
        """Test that an exception in create() is handled gracefully"""

        # Force create_user to raise an exception
        mock_create_user.side_effect = Exception("Database error")

        valid_data = {
            "username": "UniqueUser",  # Must be unique to pass serializer validation
            "first_name": "First",
            "last_name": "Last",
            "email": "unique@example.com",
            "password": "TestPassword123",
            "is_staff": False,
            "is_superuser": False,
        }

        serializer = UserSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid(), msg=f"Serializer validation failed: {serializer.errors}")
        user = serializer.create(serializer.validated_data)  # Bypass .save() 
        self.assertIsNone(user, "[ERROR] Exception handling in create() did not return None")


    def test_deserialization_valid_data(self):

        valid_data = {
            'username': 'TestUsername',
            'first_name': 'TestFirstName',
            'last_name': 'TestLastName',
            'email': 'TestEmail@example.com',
            'password': 'TestPassword123',
            'is_staff': False,
            'is_superuser': False,
        }
        serializer = UserSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid())

        user = serializer.save()
        self.assertEqual(user.username, valid_data['username'])
        self.assertEqual(user.first_name, valid_data['first_name'])
        self.assertEqual(user.last_name, valid_data['last_name'])
        self.assertEqual(user.email, valid_data['email'])
        self.assertTrue(user.check_password(valid_data['password']))  # Verify password is hashed
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_deserialization_invalid_data(self):

        invalid_data = {
            'username': 'TestUsername',
            'first_name': 'TestFirstName',
            'last_name': 'TestLastName',
            'email': 'InvalidEmailFormat',
            'password': 'TestPassword123',
            'is_staff': False,
            'is_superuser': False,
        }

        serializer = UserSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())

        self.assertIn('email', serializer.errors)



class OfficerSerializerTestCase(TestCase):
    def setUp(self):
        # Create departments
        self.departmentOne = Department.objects.create(
            name="Engineering", 
            description="Engineering Department"
        )
        self.departmentTwo = Department.objects.create(
            name="Finance", 
            description="Finance Department"
        )
        # Create users
        self.userOne = User.objects.create(
            username="john_doe", 
            email="john.doe@example.com",
            password="testpassword123",
            is_staff=True,
        )
        self.userTw = User.objects.create(
            username="@jane_doe", 
            email="jane.doe@example.com",
            password="testpassword123",
            is_staff=True,
            is_superuser=False
        )
        # Create officers
        self.officerOne = Officer.objects.create(user=self.userOne, department=self.departmentOne)
        self.userTwo = Officer.objects.create(user=self.userTw, department=self.departmentTwo)

    def test_serialization(self):
        """Test if the OfficerSerializer correctly serializes data."""
        

        
        serializer = OfficerSerializer(self.officerOne)
        serialized_data = serializer.data
        self.assertEqual(serialized_data['id'], self.officerOne.id)
        
        # Fix: Get the id from the user dictionary
        self.assertEqual(serialized_data['user']['id'], self.userOne.id)  
        self.assertEqual(serialized_data['department'], self.departmentOne.id)





    def test_deserialization_valid_data(self):
        """Test if the OfficerSerializer correctly deserializes valid data."""

        # Ensure the user is NOT already an officer before assigning them
        if Officer.objects.filter(user=self.userTw).exists():
            Officer.objects.filter(user=self.userTw).delete()

        valid_data = {
            # Pass in a dictionary since we now have the embedded user serializer
            'user': {'id': '3',
                     'username': '@charlie',
                     'email': 'charlie@example.com',
                     'password': 'testpassword123'},  
            'department': self.departmentTwo.id,
            'is_department_head': False
        }

        serializer = OfficerSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid(), "[ERROR] Serializer validation failed when it should be valid.")
        new_officer = serializer.save()

        self.assertEqual(new_officer.user.id, 3, "[ERROR] User ID mismatch after deserialization.")
        self.assertEqual(new_officer.department.id, self.departmentTwo.id, "[ERROR] Department ID mismatch after deserialization.")


    def test_deserialization_invalid_data(self):
        invalid_data = {
            'user': 'john',
            'department': 'finance',
        }
        serializer = OfficerSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('user', serializer.errors)
        self.assertIn('department', serializer.errors)



class TicketSerializerTestCase(TestCase):

    def setUp(self):
        """Create the necessary users to test the TicketSerializer."""
        self.superuser = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass",
            is_superuser=True,
            is_staff=True
        )
        
        self.student_user = User.objects.create_user(
            username="student",
            email="student@example.com",
            password="studentpass"
        )

    def test_serialization(self):
        ticket = Ticket.objects.create(
            subject="Test Ticket",
            description="This is a test ticket.",
            created_by=self.student_user,
            assigned_to=self.superuser,
            status="Open",
            priority="High",
            is_overdue=False
        )

        serializer = TicketSerializer(ticket)
        serialized_data = serializer.data

        self.assertEqual(serialized_data['subject'], ticket.subject)
        self.assertEqual(serialized_data['description'], ticket.description)
        self.assertEqual(serialized_data['created_by'], ticket.created_by.id)
        self.assertEqual(serialized_data['assigned_to'], ticket.assigned_to.id)
        self.assertEqual(serialized_data['status'], ticket.status)
        self.assertEqual(serialized_data['priority'], ticket.priority)
        self.assertEqual(serialized_data['is_overdue'], ticket.is_overdue)

    def test_deserialization_valid_data(self):

        valid_data = {
            'subject': 'Valid Ticket',
            'description': 'Description for valid ticket',
            # 'created_by': self.student_user.id, => Remove since created_by is read_only so will be ignored by the serializer
            'assigned_to': self.superuser.id,
            'status': 'Open',
            'priority': 'Medium',
            'is_overdue': False,
        }
        

        serializer = TicketSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid())
       
        """
        CHECK: explicitly setting the created_by field for the ticket object, as otherwise the ticket won't have a created_by value,
        since it is read_only in the serializer 
        """
        ticket = serializer.save(created_by=self.student_user)

        self.assertEqual(ticket.subject, valid_data['subject'])
        self.assertEqual(ticket.description, valid_data['description'])
        self.assertEqual(ticket.created_by, self.student_user)
        self.assertEqual(ticket.assigned_to, self.superuser)
        self.assertEqual(ticket.status, valid_data['status'])
        self.assertEqual(ticket.priority, valid_data['priority'])
        self.assertEqual(ticket.is_overdue, valid_data['is_overdue'])

    def test_deserialization_invalid_data(self):

        invalid_data = {
            'subject': 'Valid Ticket',
            'description': 'Description for valid ticket',
            # 'created_by': 'john', => No need for this as created_by is read_only so will be ignored by the serializer
            'assigned_to': 'smith',
            'status': 'Open',
            'priority': 'Medium',
            'is_overdue': False,
        }
        

        serializer = TicketSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
       
        """
        CHECK: remove created_by assertion, since created_by is read_only, it isn't validated by the serializer 
        when passing it to the serializer as data 
        """
        # self.assertIn('created_by', serializer.errors)
        self.assertIn('assigned_to', serializer.errors)

class DepartmentSerializerTestCase(TestCase):
    def setUp(self):
        self.department = Department.objects.create(
            name = 'Finance'
        )
    
    def test_serialization(self):
        serializer = DepartmentSerializer(self.department)
        serialized_data = serializer.data

        self.assertEqual(serialized_data['id'], self.department.id)
        self.assertEqual(serialized_data['name'], self.department.name)
        
    def test_deserialization_valid_data(self):
        valid_data = {
            'name': 'TestDepartment',
        }

        serializer = DepartmentSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid())

        department = serializer.save()

        self.assertEqual(department.name, valid_data['name'])

    def test_deserialization_invalid_data(self):
        invalid_data = {
            'name': 'Finance',
        }

        serializer = DepartmentSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)





class TicketRedirectSerializerTestCase(TestCase):
    def setUp(self):
        self.user_one = User.objects.create_user(
            username="john_doe", email="john.doe@example.com", password="password123"
        )
        self.user_two = User.objects.create_user(
            username="jane_doe", email="jane.doe@example.com", password="password123"
        )
        
        self.ticket = Ticket.objects.create(
            subject="Test Ticket",
            description="This is a test ticket.",
            created_by=self.user_one,
            assigned_to=self.user_two,
            status="Open",
            priority="High",
            is_overdue=False
        )

        self.ticket_redirect = TicketRedirect.objects.create(
            ticket=self.ticket,
            from_profile=self.user_one,
            to_profile=self.user_two
        )

    def test_serialization(self):

        serializer = TicketRedirectSerializer(self.ticket_redirect)
        serialized_data = serializer.data

        self.assertEqual(serialized_data['ticket'], self.ticket.id)
        self.assertEqual(serialized_data['from_profile'], self.user_one.id)
        self.assertEqual(serialized_data['to_profile'], self.user_two.id)

    def test_deserialization_valid_data(self):

        valid_data = {
            'ticket': self.ticket.id,
            'from_profile': self.user_one.id,
            'to_profile': self.user_two.id,
        }
        serializer = TicketRedirectSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid())
        ticket_redirect = serializer.save()

        self.assertEqual(ticket_redirect.ticket, self.ticket)
        self.assertEqual(ticket_redirect.from_profile, self.user_one)
        self.assertEqual(ticket_redirect.to_profile, self.user_two)

    def test_deserialization_invalid_data(self):

        invalid_data = {
            'ticket': self.ticket.id,
            'from_profile': 'John',
            'to_profile': self.user_two.id,
        }
        serializer = TicketRedirectSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('from_profile', serializer.errors)

class TicketMessageSerializerTestCase(TestCase):
    def setUp(self):
        self.sender_profile = User.objects.create_user(
            username="john_doe", email="john.doe@example.com", password="password123"
        )
        self.user_two = User.objects.create_user(
            username="jane_doe", email="jane.doe@example.com", password="password123"
        )
        
        self.ticket = Ticket.objects.create(
            subject="Test Ticket",
            description="This is a test ticket.",
            created_by=self.sender_profile,
            assigned_to=self.user_two,
            status="Open",
            priority="High",
            is_overdue=False
        )

        self.ticket_message = TicketMessage.objects.create(
            ticket=self.ticket,
            sender_profile=self.sender_profile,
            message_body="This is a test message.",
        )

    def test_serialization(self):
        serializer = TicketMessageSerializer(self.ticket_message)
        serialized_data = serializer.data
        self.assertEqual(serialized_data['ticket'], self.ticket_message.ticket.id)
        self.assertEqual(serialized_data['sender_profile'], self.ticket_message.sender_profile.id)
        self.assertEqual(serialized_data['message_body'], self.ticket_message.message_body)

    def test_deserialization_valid_data(self):
        valid_data = {
            'ticket': self.ticket.id,
            'sender_profile': self.sender_profile.id,
            'message_body': "This is a valid test message."
        }

        serializer = TicketMessageSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid())

        ticket_message = serializer.save()

        self.assertEqual(ticket_message.ticket.id, valid_data['ticket'])
        self.assertEqual(ticket_message.sender_profile.id, valid_data['sender_profile'])
        self.assertEqual(ticket_message.message_body, valid_data['message_body'])



    def test_deserialization_invalid_data(self):
        invalid_data = {
            'ticket': self.ticket.id,
            'sender_profile': 'john',
            'message_body': 'This is a valid test message.'
        }

        serializer = TicketMessageSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('sender_profile', serializer.errors)



class NotificationSerializerTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="john_doe", 
            email="john.doe@example.com", 
            password="password123"
        )
        
        self.ticket = Ticket.objects.create(
            subject="Test Ticket",
            description="This is a test ticket.",
            created_by=self.user,
            assigned_to=self.user,
            status="Open",
            priority="High",
            is_overdue=False
        )

        # Create the notification by passing the ticket, not ticket_subject
        self.notification = Notification.objects.create(
            user_profile=self.user,  # Add the user_profile field
            ticket=self.ticket,       # Pass the ticket object, not ticket_subject
            message="This is a test notification.",
            read_status=False
        )

    def test_serialization(self):
        serializer = NotificationSerializer(self.notification)
        serialized_data = serializer.data
        self.assertEqual(serialized_data['user_profile'], self.user.id)
        self.assertEqual(serialized_data['ticket_subject'], self.ticket.subject)
        self.assertEqual(serialized_data['message'], self.notification.message)
        self.assertEqual(serialized_data['read_status'], self.notification.read_status)

    def test_deserialization_valid_data(self):
        valid_data = {
            'user_profile': self.user.id,
            'ticket_subject': self.ticket,
            'message': "This is a valid notification message.",
            'read_status': False
        }
        serializer = NotificationSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())

        notification = serializer.save()

        self.assertEqual(notification.user_profile.id, valid_data['user_profile'])
        self.assertEqual(notification.message, valid_data['message'])
        self.assertEqual(notification.read_status, valid_data['read_status'])

    def test_deserialization_invalid_data(self):
        invalid_data = {
            'user_profile': 'John',
            'ticket': self.ticket,
            'message': "",
            'read_status': False
        }
        serializer = NotificationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('message', serializer.errors)
        
class ChangeTicketDateSerializerTestCase(TestCase):
    def test_create_method(self):
        """Test that create() method correctly returns validated data"""

        valid_data = {
            "id": 1,
            "due_date": timezone.now()
        }

        serializer = ChangeTicketDateSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid(), msg=f"Serializer validation failed: {serializer.errors}")

        created_data = serializer.create(serializer.validated_data)

        self.assertEqual(created_data, valid_data, "[ERROR] create() did not return expected validated data")