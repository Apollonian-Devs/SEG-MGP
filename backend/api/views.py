from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, views
from rest_framework.response import Response
from .serializers import UserSerializer, TicketSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Ticket
from django.core.exceptions import ObjectDoesNotExist

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .helpers import *

from django.shortcuts import get_object_or_404


class TicketListCreate(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Ticket.objects.filter(created_by=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)

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





class TicketMessageHistory(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        try:
            # Fetch the ticket by ID
            ticket = Ticket.objects.get(id=ticket_id)
            
            # Get the message history for the ticket
            messages = get_message_history(ticket)
            
            # Return the messages as a response
            return Response({"messages": messages}, status=200)
        except ObjectDoesNotExist:
            return Response({"error": "Ticket not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)