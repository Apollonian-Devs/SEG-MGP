from django.contrib.auth.models import User
from rest_framework import generics, views
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from api.serializers import UserSerializer
from api.helpers import send_email

class CreateUserView(generics.CreateAPIView):
    """  
    Creates a new user account and sends welcome email.

    @permission: AllowAny  
    @method: POST - Register a new user  

    @request_body:  
        - username (string)  
        - password (string)  
        - email (string)  
        - first_name (string, optional)  
        - last_name (string, optional)  

    @return:  
        - 201: Created user with serialized data  
        - 400: Invalid input data  
    """
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
    """  
    Retrieves current authenticated user's profile data.

    @permission: IsAuthenticated  
    @method: GET - Get current user details  

    @return:  
        - 200: Successful response with user data  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)