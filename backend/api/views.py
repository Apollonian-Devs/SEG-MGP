from django.contrib.auth.models import User
from rest_framework import generics, views
from rest_framework.response import Response
from .serializers import UserSerializer, TicketSerializer, TicketMessageSerializer, TicketRedirectSerializer, OfficerSerializer, NotificationSerializer, ChangeTicketDateSerializer
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
            attachments=data.get("attachments")
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
"""class TicketSendResponseView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, ticket_id):

        serializer = TicketMessageSerializer(data=request.data)
        if serializer.is_valid():
        
            try:

                comment = send_response(
                    sender_profile=serializer.validated_data['sender_profile'],
                    ticket=serializer.validated_data['ticket'],
                    message_body=serializer.validated_data['message_body'],
                )
                
            
                serializer = TicketMessageSerializer(comment)
                return Response(serializer.data, status=201)

            except Ticket.DoesNotExist:
                return Response({"error": "Ticket not found"}, status=404)
            except ValueError as e:
                return Response({"error": str(e)}, status=400)
        else:
            print(serializer.errors)
            return Response(serializer.errors)"""

class TicketSendResponseView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, ticket_id):
       
        data = {
            "sender_profile": request.user.id, 
            "ticket": ticket_id,               
            "message_body": request.data.get("message_body")
        }
        
        serializer = TicketMessageSerializer(data=data)
        
        if serializer.is_valid():
            try:
                comment = send_response(
                    sender_profile=serializer.validated_data["sender_profile"],
                    ticket=serializer.validated_data["ticket"],
                    message_body=serializer.validated_data["message_body"],
                )
                serializer = TicketMessageSerializer(comment)
                return Response(serializer.data, status=201)
            except Ticket.DoesNotExist:
                return Response({"error": "Ticket not found"}, status=404)
            except ValueError as e:
                return Response({"error": str(e)}, status=400)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)



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
        request.data['from_profile'] = request.user.id

        serializer = TicketRedirectSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                ticket_id = serializer.validated_data['ticket'].id
                from_user_id = serializer.validated_data['from_profile'].id
                to_user_id = serializer.validated_data['to_profile'].id
                ticket = Ticket.objects.get(id=ticket_id)  
                from_user = User.objects.get(id=from_user_id)  
                to_user = User.objects.get(id=to_user_id)  


                updated_ticket = redirect_query(ticket, from_user, to_user)
                serializer = TicketSerializer(updated_ticket)

                return Response(
                    {"ticket": serializer.data},
                    status=201
                )
            except Exception as e:
                print(f"error occured: {e}")
                return Response({"error": "an error has occured"})
        else:
            return Response(serializer.errors)



class OverdueTicketsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        overdue_tickets = get_overdue_tickets(user) 
        serializer = TicketSerializer(overdue_tickets, many=True)  
        return Response({"tickets": serializer.data})  

    

class ChangeTicketDateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        user = request.user
        serializer = ChangeTicketDateSerializer(data=request.data)

        if serializer.is_valid():
            try:
                ticket_id = serializer.validated_data['id']
                ticket = Ticket.objects.get(id=ticket_id)
                new_due_date = serializer.validated_data['due_date']
            
                updated_ticket = changeTicketDueDate(ticket, user, new_due_date)
                
                serializer = TicketSerializer(updated_ticket)

                return Response({"ticket": serializer.data}, status=201)
            
            except Ticket.DoesNotExist:
                return Response({"error": "Ticket not found"}, status=404)
            except ValueError as e:
                print("The error", str(e))
                return Response({"error": str(e)}, status=400)
        else:
            print("Serializer errors: ", serializer.errors)
            return Response(serializer.errors)

