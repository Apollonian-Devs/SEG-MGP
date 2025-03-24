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
    changeTicketPriority, changeTicketDueDate
)

class TicketListCreate(generics.ListCreateAPIView):
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

class TicketChangePriority(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            ticket = Ticket.objects.get(id=id)
            changeTicketPriority(ticket, request.user)
            return Response({"message": "Priority changed"})
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status=404)
        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)

class TicketDelete(generics.DestroyAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(created_by=self.request.user)

class TicketSendResponseView(views.APIView):
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

class TicketMessageHistory(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        try:
            ticket = Ticket.objects.get(id=ticket_id)
            messages = get_message_history(ticket)
            for msg in messages:
                ticket_msg = TicketMessage.objects.get(id=msg["message_id"])
                msg["attachments"] = TicketMessageSerializer(ticket_msg).data.get("attachments", [])
            return Response({"messages": messages})
        except ObjectDoesNotExist:
            return Response({"error": "Ticket not found"}, status=404)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)

class TicketRedirectView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.data['from_profile'] = request.user.id
        serializer = TicketRedirectSerializer(data=request.data)
        if serializer.is_valid():
            try:
                ticket = serializer.validated_data['ticket']
                from_user = serializer.validated_data['from_profile']
                to_user = serializer.validated_data['to_profile']
                updated_ticket = redirect_query(ticket, from_user, to_user)
                return Response({"ticket": TicketSerializer(updated_ticket).data}, status=201)
            except Exception:
                return Response({"error": "An error has occurred"}, status=500)
        return Response(serializer.errors, status=400)

class TicketStatusHistoryView(views.APIView):
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

class ChangeTicketDateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeTicketDateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        try:
            ticket = Ticket.objects.get(id=serializer.validated_data['id'])
            updated_ticket = changeTicketDueDate(ticket, request.user, serializer.validated_data['due_date'])
            return Response({"ticket": TicketSerializer(updated_ticket).data}, status=201)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status=404)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)

