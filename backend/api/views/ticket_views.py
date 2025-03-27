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