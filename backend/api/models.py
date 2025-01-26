from django.db import models
from django.db.models import Q, F
from django.contrib.auth.models import User

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(role_name__in=["Student", "Officer", "Administrator"]),
                name="valid_role_name"
            )
        ]

    def __str__(self):
        return self.role_name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    role = models.ForeignKey(Role, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.role.role_name}"   



class Inquiry(models.Model):
  
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    student_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='inquiries')

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(student_profile__role__role_name="Student"),
                name="inquiry_only_for_students"
            )
        ]

    def __str__(self):
        return self.title


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category_name
    
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category_name

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

    ticket_id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=255)
    description = models.TextField()

    created_by_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='tickets_created'
    )
    assigned_to_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets_assigned'
    )

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Open")
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    is_overdue = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(due_date__isnull=True) | Q(due_date__gte=F('created_at')),
                name='ticket_due_date_gte_created'
            )
        ]

    def __str__(self):
        return f"{self.subject} (ID: {self.ticket_id})"

class TicketMessage(models.Model):
    message_id = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    sender_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    message_body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_internal = models.BooleanField(default=False)

    def __str__(self):
        return f"Msg {self.message_id} on Ticket {self.ticket_id}"
    

class TicketStatusHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    old_status = models.CharField(max_length=50, null=True)
    new_status = models.CharField(max_length=50)
    changed_by_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    changed_at = models.DateTimeField(auto_now_add=True)
    notes = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Ticket #{self.ticket.ticket_id} from {self.old_status} to {self.new_status}"
    

class TicketRedirect(models.Model):
    redirect_id = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    from_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='redirect_from')
    to_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='redirect_to')
    reason = models.CharField(max_length=255, null=True, blank=True)
    redirected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Redirect #{self.redirect_id} for Ticket #{self.ticket.ticket_id}"

class TicketAttachment(models.Model):
    attachment_id = models.AutoField(primary_key=True)
    message = models.ForeignKey(TicketMessage, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)  # or FileField
    mime_type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment #{self.attachment_id} on Msg {self.message_id}"
    

class AIResponse(models.Model):
    ai_response_id = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    prompt_text = models.TextField(null=True, blank=True)
    response_text = models.TextField(null=True, blank=True)
    confidence = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    verified_by_profile = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True)
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
        return f"AI Response #{self.ai_response_id} for Ticket #{self.ticket.ticket_id}"
    
class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    ticket= models.ForeignKey(Ticket, on_delete=models.CASCADE, null=True, blank=True)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)   
    read_status = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification #{self.notification_id} for {self.user_profile.user.username}"

