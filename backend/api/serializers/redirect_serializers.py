from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import TicketRedirect, Ticket

class TicketRedirectSerializer(serializers.ModelSerializer):
    ticket = serializers.PrimaryKeyRelatedField(queryset=Ticket.objects.all())
    from_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    to_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = TicketRedirect
        fields = ["ticket", "from_profile", "to_profile"]

class TicketPathSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source="from_profile.username", read_only=True)
    to_username = serializers.CharField(source="to_profile.username", read_only=True)

    class Meta:
        model = TicketRedirect
        fields = ["from_username", "to_username"]
        extra_kwargs = {"ticket": {"read_only": True}}
        