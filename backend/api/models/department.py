from django.db import models

class Department(models.Model):
    """  
    Represents an organizational department handling tickets.

Fields:
    - name: Unique department name
    - description: Brief department description
    """  
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name