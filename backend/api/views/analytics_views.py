from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from api.helpers import get_tags

class GroupTicketsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            clusters = get_tags(request.user)
            if "error" in clusters:
                return Response({"error": clusters["error"]}, status=400)
            return Response({"clusters": clusters})
        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception as e:
            return Response({"error": f"An error has occurred: {str(e)}"}, status=500)
