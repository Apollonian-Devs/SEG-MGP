from django.contrib.auth.models import User
from rest_framework import generics, views
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from api.serializers import UserSerializer
from api.helpers import send_email

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        send_email(
            user,
            f"Welcome {user.first_name} {user.last_name}",
            f"you made an account {user.username}"
        )

class CurrentUserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)