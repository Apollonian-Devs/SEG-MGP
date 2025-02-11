from django.db import models
from django.db.models import Q, F
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist



def get_default_superuser():
    try:
        return User.objects.filter(is_superuser=True).first()
    except ObjectDoesNotExist:
        return None
    


class Department(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

class Officer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)

    def __str__(self):
        return self.user.username

"""
Status: Could be used later on, to categorise departments
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category_name
"""
class Ticket(models.Model):
    STATUS_CHOICES = [
        ("Open", "Open"),
        ("In Progress", "In Progress"),
        ("Awaiting Student", "Awaiting Student"),
        ("Closed", "Closed"),
    ]
    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]
    subject = models.CharField(max_length=255)
    description = models.TextField()

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tickets_created'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        default=get_default_superuser,
        null=True,
        blank=True,
        related_name='tickets_assigned'
    )

    #category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Open")
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    is_overdue = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.created_by.is_staff or self.created_by.is_superuser:
            raise ValidationError("Only student users can create tickets.")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.subject

class TicketMessage(models.Model):
     ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
     sender_profile = models.ForeignKey(User, on_delete=models.CASCADE)
     message_body = models.TextField()
     created_at = models.DateTimeField(auto_now_add=True)
     is_internal = models.BooleanField(default=False)

     def __str__(self):
        return f"Msg {self.id} on Ticket {self.ticket_id}"
    
    

class TicketStatusHistory(models.Model):
     ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
     old_status = models.CharField(max_length=50, null=True)
     new_status = models.CharField(max_length=50)
     changed_by_profile = models.ForeignKey(User, on_delete=models.CASCADE)
     changed_at = models.DateTimeField(auto_now_add=True)
     notes = models.CharField(max_length=255, null=True, blank=True)

     def __str__(self):
        return f"Ticket #{self.ticket.ticket_id} from {self.old_status} to {self.new_status}"
    
class TicketRedirect(models.Model):
     ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
     from_profile = models.ForeignKey(User, on_delete=models.CASCADE, related_name='redirect_from')
     to_profile = models.ForeignKey(User, on_delete=models.CASCADE, related_name='redirect_to')
     reason = models.CharField(max_length=255, null=True, blank=True)
     redirected_at = models.DateTimeField(auto_now_add=True)

     def __str__(self):
        return f"Redirect #{self.id} for Ticket #{self.ticket.ticket_id}"

class TicketAttachment(models.Model):
    message = models.ForeignKey(TicketMessage, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)  # or FileField
    mime_type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment #{self.id} on Msg {self.message_id}"
    


class AIResponse(models.Model):
     ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
     prompt_text = models.TextField(null=True, blank=True)
     response_text = models.TextField(null=True, blank=True)
     confidence = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
     created_at = models.DateTimeField(auto_now_add=True)

     verified_by_profile = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
     verification_status = models.CharField(max_length=50, null=True, blank=True)

     class Meta:
         constraints = [
             models.CheckConstraint(
                 check=(
                     Q(confidence__isnull=True)
                     | (Q(confidence__gte=0) & Q(confidence__lte=100))
                 ),
                 name='ai_confidence_range_0_100'
             )
         ]
    
     def __str__(self):
       return f"AI Response #{self.id} for Ticket #{self.ticket.ticket_id}"
    
class Notification(models.Model):
     user_profile = models.ForeignKey(User, on_delete=models.CASCADE)
     ticket= models.ForeignKey(Ticket, on_delete=models.CASCADE, null=True, blank=True)
     message = models.CharField(max_length=255)
     created_at = models.DateTimeField(auto_now_add=True)   
     read_status = models.BooleanField(default=False)

     def __str__(self):
        return f"Notification #{self.id} for {self.user_profile.username}"