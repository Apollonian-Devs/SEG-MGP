from rest_framework import serializers
from api.models import TicketStatusHistory

class TicketStatusHistorySerializer(serializers.ModelSerializer):
    profile_username = serializers.CharField(source="changed_by_profile.username", read_only=True)

    class Meta:
        model = TicketStatusHistory
        fields = ["old_status", "new_status", "profile_username", "changed_at", "notes"]
        extra_kwargs = {"ticket": {"read_only": True}}
        