from django.test import TestCase
from django.contrib.auth.models import User
from api.models import get_default_superuser

class GetDefaultSuperuserTest(TestCase):
    
    def test_get_default_superuser_no_exists(self):
        superuser = get_default_superuser()
        print("Superuser: " , superuser)
        self.assertEqual(superuser, None)
    
    def test_get_default_superuser_exists(self):
        superuser = User.objects.create_superuser(username='superuser', password='password')
        
        result = get_default_superuser()
        self.assertEqual(result, superuser)


