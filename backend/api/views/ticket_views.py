from rest_framework import generics, views, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied, ValidationError, ObjectDoesNotExist
from django.contrib.auth.models import User
from api.models import Ticket, TicketMessage, TicketAttachment, Notification
from api.serializers import (
    TicketSerializer, TicketMessageSerializer, TicketRedirectSerializer,
    ChangeTicketDateSerializer, TicketStatusHistorySerializer, TicketPathSerializer
)
from api.helpers import (
    send_query, send_response, get_message_history, redirect_query,
    get_ticket_history, get_ticket_path, changeTicketStatus,
    changeTicketPriority, changeTicketDueDate, get_department_head
)

class TicketListCreate(generics.ListCreateAPIView):
    """  
    Lists or creates tickets for authenticated users.

    @permission: IsAuthenticated  
    @method:  
        - GET - List user's tickets  
        - POST - Create new ticket  

    @request_body (POST):  
        - subject (string)  
        - description (string)  
        - message (string)  
        - attachments (list, optional)  

    @return:  
        - 200: List of tickets (GET)  
        - 201: Created ticket (POST)  
        - 400: Invalid input  
        - 500: Unexpected server error  
    """
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        try:
            data = serializer.validated_data
            new_ticket = send_query(
                student_user=self.request.user,
                subject=data.get("subject"),
                description=data.get("description"),
                message_body=data.get("message"),
                attachments=data.get("attachments")
            )
            serializer.instance = new_ticket
        except Exception:
            raise serializers.ValidationError({"error": "An error has occurred"})

class TicketChangeStatus(views.APIView):
    """  
    Changes ticket status through status cycle.

    @permission: IsAuthenticated  
    @method: GET - Cycle ticket status  

    @param: id (URL parameter) - Ticket ID  

    @return:  
        - 200: Status changed successfully  
        - 403: Permission denied  
        - 404: Ticket not found  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            ticket = Ticket.objects.get(id=id)
            changeTicketStatus(ticket, request.user)
            return Response({"message": "Status changed"})
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status=404)
        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)


class TicketDelete(generics.DestroyAPIView):
    """  
    Deletes a ticket created by the authenticated user.

    @permission: IsAuthenticated  

    @method:  
        - DELETE - Remove a ticket created by the requesting user  

    @queryset:  
        - Filters tickets where `created_by` matches the authenticated user  

    @return:  
        - 204: Ticket successfully deleted  
        - 403: Permission denied  
        - 404: Ticket not found  
        - 500: Unexpected server error  
    """
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(created_by=self.request.user)
    

class TicketMessageHistory(views.APIView):
    """  
    Retrieves the message history for a specific ticket.

    @permission: IsAuthenticated  

    @method:  
        - GET - Retrieve message history for a given ticket  

    @request_params (GET):  
        - ticket_id (integer) - The ID of the ticket  

    @return:  
        - 200: List of messages associated with the ticket  
        - 404: Ticket not found  
        - 500: Unexpected server error  
    """
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
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)
        
class TicketRedirectView(views.APIView):
    """  
    Handles ticket redirection to another user or department.

    @permission: IsAuthenticated  

    @method:  
        - POST - Redirect a ticket to another user or department  

    @request_body (POST):  
        - ticket (integer) - The ID of the ticket to be redirected  
        - to_profile (integer) - The ID of the user receiving the ticket  
        - department_id (integer, optional) - The ID of the department (for superusers)  

    @return:  
        - 201: Successfully redirected ticket  
        - 400: Invalid request (e.g., no department head found)  
        - 500: Unexpected server error  
    """
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

        
        response = self.redirect_ticket(request)
        
        return response
    
    def redirect_ticket(self, request):
        """
        Handles the ticket redirection process, including validating data and redirecting the ticket.
        """
        serializer = TicketRedirectSerializer(data=request.data)

        if serializer.is_valid():
            try:
                ticket_id = serializer.validated_data['ticket'].id
                from_user_id = serializer.validated_data['from_profile'].id
                to_user_id = serializer.validated_data['to_profile'].id

                # Fetch users and ticket
                ticket = Ticket.objects.get(id=ticket_id)
                from_user = User.objects.get(id=from_user_id)
                to_user = User.objects.get(id=to_user_id)

                # Redirect the ticket
                updated_ticket = redirect_query(ticket, from_user, to_user)
                ticket_serializer = TicketSerializer(updated_ticket)

                return Response({"ticket": ticket_serializer.data}, status=201)
            except Exception as e:
                print(f"error occurred: {e}")
                return Response({"error": "An error has occurred"}, status=500)
        else:
            print(f"Serializer errors: ", serializer.errors)
            return Response(serializer.errors, status=400)
        


class TicketChangePriority(views.APIView):
    """  
    Changes the priority of a specified ticket.

    @permission: IsAuthenticated  

    @method:  
        - GET - Change the priority of a given ticket  

    @request_params (GET):  
        - id (integer) - The ID of the ticket whose priority is being changed  

    @return:  
        - 200: Priority successfully changed  
        - 403: Permission denied  
        - 404: Ticket not found  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            ticket = Ticket.objects.get(id=id)
            user = request.user
            changeTicketPriority(ticket, user)
            return Response({"message": "Priority changed"}, status= 200)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status= 404)
        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)
        

        
class TicketStatusHistoryView(views.APIView):
    """  
    Retrieves the status change history of a specific ticket.

    @permission: IsAuthenticated  

    @method:  
        - GET - Retrieve the status change history for a given ticket  

    @request_params (GET):  
        - ticket_id (integer) - The ID of the ticket whose history is being retrieved  

    @return:  
        - 200: List of status change history records  
        - 403: Permission denied  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        try:
            history = get_ticket_history(request.user, Ticket.objects.get(id=ticket_id))
            serializer = TicketStatusHistorySerializer(history, many=True)
            return Response({"status_history": serializer.data})
        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)


class TicketPathView(views.APIView):
    """  
    Retrieves the redirection path of a specific ticket.

    @permission: IsAuthenticated  

    @method:  
        - GET - Retrieve the redirection path for a given ticket  

    @request_params (GET):  
        - ticket_id (integer) - The ID of the ticket whose path is being retrieved  

    @return:  
        - 200: List of redirection path records  
        - 403: Permission denied  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        try:
            path = get_ticket_path(request.user, Ticket.objects.get(id=ticket_id))
            serializer = TicketPathSerializer(path, many=True)
            return Response({"ticket_path": serializer.data})
        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)



class TicketSendResponseView(views.APIView):
    """  
    Sends response message to a ticket.

    @permission: IsAuthenticated  
    @method: POST - Submit ticket response  

    @param: ticket_id (URL parameter)  
    @request_body:  
        - message_body (string)  
        - attachments (list, optional):  
            - file_name (string)  
            - file_path (string)  
            - mime_type (string, optional)  

    @return:  
        - 201: Created message response  
        - 400: Invalid input  
        - 404: Ticket not found  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, ticket_id):
        data = {
            "sender_profile": request.user.id,
            "ticket": ticket_id,
            "message_body": request.data.get("message_body"),
            "attachments": request.data.get("attachments", [])
        }
        serializer = TicketMessageSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        try:
            comment = send_response(
                sender_profile=serializer.validated_data["sender_profile"],
                ticket=serializer.validated_data["ticket"],
                message_body=serializer.validated_data["message_body"]
            )
            for attachment in data["attachments"]:
                TicketAttachment.objects.create(
                    message=comment,
                    file_name=attachment["file_name"],
                    file_path=attachment["file_path"],
                    mime_type=attachment.get("mime_type", "application/octet-stream")
                )
            return Response(TicketMessageSerializer(comment).data, status=201)
        except ValidationError as e:
            return Response({"error": str(e)}, status=404)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)
        
class ChangeTicketDateView(views.APIView):
    """  
    Changes the due date of a specified ticket.

    @permission: IsAuthenticated  

    @method:  
        - POST - Update the due date of a given ticket  

    @request_body (POST):  
        - id (integer) - The ID of the ticket whose due date is being changed  
        - due_date (string) - The new due date in a valid date format  

    @return:  
        - 201: Successfully updated ticket due date  
        - 400: Invalid input (e.g., incorrect date format)  
        - 404: Ticket not found  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        user = request.user
        serializer = ChangeTicketDateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
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
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)
        
        