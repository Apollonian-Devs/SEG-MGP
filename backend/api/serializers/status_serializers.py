from rest_framework import serializers
from api.models import TicketStatusHistory

class TicketStatusHistorySerializer(serializers.ModelSerializer):
    """  
    Serializes ticket status change history.

Fields:
    - old_status: Previous status
    - new_status: Updated status
    - profile_username: Changing user's username (read-only)
    - changed_at: Timestamp
    - notes: Change description

Meta:
    - extra_kwargs: Makes ticket field read-only
    """  
    profile_username = serializers.CharField(source="changed_by_profile.username", read_only=True)

    class Meta:
        model = TicketStatusHistory
        fields = ["old_status", "new_status", "profile_username", "changed_at", "notes"]
        extra_kwargs = {"ticket": {"read_only": True}}