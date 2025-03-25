from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.helpers import get_tickets_for_user, get_notifications, mark_id_as_read, get_officers_same_department, is_chief_officer, get_overdue_tickets
from api.models import get_default_superuser
from api.models import Ticket, Notification
from api.serializers import OfficerSerializer, UserSerializer, NotificationSerializer

class UserTicketsView(views.APIView):
    """
    API endpoint to get all tickets associated with the logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            get_overdue_tickets(user)
            tickets = get_tickets_for_user(user)
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
    """
    API endpoint to get all officers currently registered.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            officers = get_officers_same_department(user)

            officer_serializer = OfficerSerializer(officers, many=True) 

            admin = None
            if is_chief_officer(user):
                admin = get_default_superuser()
                admin_serializer = UserSerializer(admin)
                admin_data = admin_serializer.data
            else:
                admin_data = None

            response_data = {
                "officers": officer_serializer.data,
                "admin": admin_data
            }

            return Response(response_data)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)
