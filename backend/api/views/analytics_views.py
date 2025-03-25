from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from api.helpers import get_tags

class GroupTicketsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            clusters = get_tags(user)

            if "error" in clusters:
                print(f"❌ API Error: {clusters['error']}")
                return Response({"error": clusters["error"]}, status=400)  # Return 400 Bad Request

            return Response({"clusters": clusters}, status=200)  # Return normal response

        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception as e:
            print(f"❌ API Exception: {e}")
            return Response({"error": f"An error has occurred: {str(e)}"}, status=500)
