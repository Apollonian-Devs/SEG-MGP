from django.contrib.auth.models import User
from api.models import Officer, Department
from api.helpers import get_officers_same_department


class TestGetOfficersSameDepartment:

    def test_returns_officers_in_same_department(self):
        department = Department.objects.create(name="Test Dept", description="A test department")
        
        user1 = User.objects.create_user(username="officer1", password="pass")
        officer1 = Officer.objects.create(user=user1, department=department)
    
        user2 = User.objects.create_user(username="officer2", password="pass")
        officer2 = Officer.objects.create(user=user2, department=department)

        user3 = User.objects.create_user(username="officer3", password="pass")
        officer3 = Officer.objects.create(user=user3, department=department)


        result = get_officers_same_department(user1)

        assert len(result) == 2
        assert officer2 in result
        assert officer3 in result
        assert officer1 not in result  

    def test_returns_empty_queryset_if_officer_does_not_exist(self):

        user = User.objects.create_user(username="no_officer", password="pass")

        result = get_officers_same_department(user)

        assert result.count() == 0



