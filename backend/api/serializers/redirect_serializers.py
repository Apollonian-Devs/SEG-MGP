from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import TicketRedirect, Ticket

class TicketRedirectSerializer(serializers.ModelSerializer):
    """  
    Serializes ticket redirection data.

Fields:
    - ticket: Related ticket ID
    - from_profile: Source user ID
    - to_profile: Target user ID
    """  
    ticket = serializers.PrimaryKeyRelatedField(queryset=Ticket.objects.all())
    from_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    to_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = TicketRedirect
        fields = ["ticket", "from_profile", "to_profile"]

class TicketPathSerializer(serializers.ModelSerializer):
    """  
    Serializes ticket path history with usernames.

Fields:
    - from_username: Source username (read-only)
    - to_username: Target username (read-only)

Meta:
    - extra_kwargs: Makes ticket field read-only
    """  
    from_username = serializers.CharField(source="from_profile.username", read_only=True)
    to_username = serializers.CharField(source="to_profile.username", read_only=True)

    class Meta:
        model = TicketRedirect
        fields = ["from_username", "to_username"]
        extra_kwargs = {"ticket": {"read_only": True}}