from django.contrib.auth.models import User
from rest_framework import generics, views
from rest_framework.response import Response
from .serializers import UserSerializer, TicketSerializer, TicketMessageSerializer, TicketRedirectSerializer, OfficerSerializer, NotificationSerializer, DepartmentSerializer, ChangeTicketDateSerializer, TicketStatusHistorySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Ticket
from django.core.exceptions import ObjectDoesNotExist
from .models import *

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

        serializer.instance = new_ticket

class TicketChangeStatus(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            ticket = Ticket.objects.get(id=id)
            user = request.user
            changeTicketStatus(ticket, user)
            return Response({"message": "Status changed"}, status= 200)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status= 404)
    
class TicketChangePriority(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            ticket = Ticket.objects.get(id=id)
            user = request.user
            changeTicketPriority(ticket, user)
            return Response({"message": "Priority changed"}, status= 200)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status= 404)
    
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


class TicketSendResponseView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, ticket_id):
        data = {
            "sender_profile": request.user.id,
            "ticket": ticket_id,
            "message_body": request.data.get("message_body"),
            "attachments": request.data.get("attachments", [])  
        }

        print("Processed data before validation:", data)  # Debugging output

        serializer = TicketMessageSerializer(data=data)
        if serializer.is_valid():
            try:
                comment = send_response(
                    sender_profile=serializer.validated_data["sender_profile"],
                    ticket=serializer.validated_data["ticket"],
                    message_body=serializer.validated_data["message_body"],
                )

                for attachment in data["attachments"]:

                        TicketAttachment.objects.create(
                            message=comment,
                            file_name=attachment["file_name"],
                            file_path=attachment["file_path"],
                            mime_type=attachment["mime_type"]
                        )

                serializer = TicketMessageSerializer(comment)
                return Response(serializer.data, status=201)

            except Ticket.DoesNotExist:
                return Response({"error": "Ticket not found"}, status=404)
            except ValueError as e:
                return Response({"error": str(e)}, status=400)
        else:
            print(" Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)






class TicketMessageHistory(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        try:
            ticket = Ticket.objects.get(id=ticket_id)
            messages = get_message_history(ticket)

            for msg in messages:
                ticket_message_obj = TicketMessage.objects.get(id=msg["message_id"])
                msg["attachments"] = TicketMessageSerializer(ticket_message_obj).data.get("attachments", [])

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

        department_id = request.data.get('department_id')
        if department_id and request.user.is_superuser:
            department_head = get_department_head(department_id)
            if department_head:
                request.data['to_profile'] = department_head.id
            else:
                return Response({"error": "No department head found for this department"}, status=400)



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
                return Response({"error": "an error has occured"}, status=400)
        else:
            print(f"Serializer errors: ", serializer.errors)
            return Response(serializer.errors, status=400)
        
class TicketStatusHistoryView(views.APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, ticket_id):
        try:
            user = request.user
            ticket = Ticket.objects.get(id=ticket_id)
            status_history = get_ticket_history(user,ticket)
            serializer = TicketStatusHistorySerializer(status_history, many=True)
            return Response({"status_history": serializer.data})
        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


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
            return Response(serializer.errors, status=400)

class DepartmentsListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        departments = Department.objects.all()
        return Response([{
            "id": dept.id,
            "name": dept.name,
            "description": dept.description
        } for dept in departments])
        
class RandomDepartmentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        department = get_random_department()
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)