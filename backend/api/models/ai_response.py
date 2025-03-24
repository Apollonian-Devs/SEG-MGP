from django.db import models
from django.contrib.auth.models import User
from .ticket import Ticket
from django.db.models import Q

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
        return f"AI Response #{self.id} for Ticket #{self.ticket.id}"