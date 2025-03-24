from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.helpers import get_tickets_for_user, get_notifications, mark_id_as_read, get_officers_same_department, is_chief_officer, get_overdue_tickets, get_default_superuser
from api.models import Ticket, Notification
from api.serializers import OfficerSerializer, UserSerializer, NotificationSerializer

class UserTicketsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            get_overdue_tickets(request.user)
            tickets = get_tickets_for_user(request.user)
            return Response({"tickets": tickets})
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)

class UserNotificationsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            notifications = get_notifications(request.user)
            serializer = NotificationSerializer(notifications, many=True)
            return Response({"notifications": serializer.data})
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)

    def post(self, request):
        try:
            notification_id = request.data.get("id")
            notification = Notification.objects.filter(id=notification_id).first()
            if not notification:
                raise Exception
            mark_id_as_read(notification_id)
            return Response({"message": "mark success"})
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)

class AllOfficersView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            officers = get_officers_same_department(request.user)
            officer_serializer = OfficerSerializer(officers, many=True)
            admin_data = None
            if is_chief_officer(request.user):
                admin = get_default_superuser()
                admin_data = UserSerializer(admin).data if admin else None
            return Response({"officers": officer_serializer.data, "admin": admin_data})
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)
