from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from api.helpers import get_tags

class GroupTicketsView(views.APIView):
    """  
    Provides ticket clustering suggestions for admin users.

    @permission: IsAuthenticated  
    @method: GET - Retrieve ticket clusters for current user  

    @return:  
        - 200: Successful response with cluster data  
        - 400: Error in clustering process  
        - 403: Permission denied  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            clusters = get_tags(user)

            if "error" in clusters:
                print(f"❌ API Error: {clusters['error']}")
                return Response({"error": clusters["error"]}, status=400)

            return Response({"clusters": clusters}, status=200)

        except PermissionDenied:
            return Response({"error": "Permission denied"}, status=403)
        except Exception as e:
            print(f"❌ API Exception: {e}")
            return Response({"error": f"An error has occurred: {str(e)}"}, status=500)