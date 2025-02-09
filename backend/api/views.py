from django.contrib.auth.models import User
from rest_framework import generics, views
from rest_framework.response import Response
from .serializers import UserSerializer, TicketSerializer, TicketMessageSerialiser, OfficerSerializer, NotificationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Ticket
from django.core.exceptions import ObjectDoesNotExist

from .helpers import *




class TicketListCreate(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Ticket.objects.filter(created_by=user)

    def perform_create(self, serializer):
        data = serializer.validated_data
        new_ticket = send_query(
            student_user=self.request.user,
            subject=data.get("subject"),
            description=data.get("description"),
            message_body=data.get("message"),
            attachments=data.get("attachments", None)
        )

        return new_ticket


class TicketDelete(generics.DestroyAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Ticket.objects.filter(created_by=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CurrentUserView(views.APIView):
    """
    API endpoint to retrieve the details of the currently authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)  # Use your UserSerializer to serialize the user data
        return Response(serializer.data)

    
class UserTicketsView(views.APIView):
    """
    API endpoint to get all tickets associated with the logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tickets = get_tickets_for_user(user)  # Call helper function
        return Response({"tickets": tickets})



#sender_user, ticket, message_body, is_internal=False
class TicketSendResponseView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, ticket_id):
        try:

            ticket = Ticket.objects.get(id=ticket_id)

            comment = send_response(
                sender_user=request.user,
                ticket=ticket,
                message_body=request.data.get("message_body")
            )
            
           
            serializer = TicketMessageSerialiser(comment)
            return Response(serializer.data, status=201)

        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status=404)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)


class TicketMessageHistory(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        try:
         
            ticket = Ticket.objects.get(id=ticket_id)
            
   
            messages = get_message_history(ticket)
            

            return Response({"messages": messages}, status=200)
        except ObjectDoesNotExist:
            return Response({"error": "Ticket not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class AllOfficersView(views.APIView):
    """
    API endpoint to get all officers currently registered.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        officers = get_officers_same_department(user)
        serializer = OfficerSerializer(officers, many=True)
        return Response(serializer.data)

class UserNotificationsView(views.APIView):
    """
    API endpoint to get all notifications associated with the logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        notifications = get_notifications(user)  # Call helper function
        serializer = NotificationSerializer(notifications, many=True)
        return Response({"notifications": serializer.data})
    
    def post(self,request):
        mark_id_as_read(request.data.get("id"))
        return Response({"message": "mark success"})
    



class TicketRedirectView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:

            ticket_id = request.data.get('ticket_id')
            to_user_id = request.data.get('to_user')
            new_status = request.data.get('new_status', 'Pending') 
            new_priority = request.data.get('new_priority', 'High')
            reason = request.data.get('reason', 'No reason provided')

            ticket = Ticket.objects.get(id=ticket_id)
            to_user = User.objects.get(id=to_user_id)
            from_user = request.user

            updated_ticket = redirect_query(ticket, from_user, to_user, new_status, new_priority, reason)
            serializer = TicketSerializer(updated_ticket)

            return Response(
                {"ticket": serializer.data},
                status=201
            )
        except:
            return Response({"error": "an error has occured"})

