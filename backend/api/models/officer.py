from django.db import models
from django.contrib.auth.models import User
from .department import Department

class Officer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    is_department_head = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username