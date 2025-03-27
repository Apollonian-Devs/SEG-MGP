from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.models import Department
from api.DepartmentSuggestionAI import suggest_department

class DepartmentsListView(APIView):
    """  
    Lists all available departments.

    @permission: AllowAny  
    @method: GET - Retrieve all departments  

    @return:  
        - 200: List of department objects  
        - 500: Unexpected server error  
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            departments = Department.objects.all()
            return Response([{
                "id": dept.id,
                "name": dept.name,
                "description": dept.description
            } for dept in departments])
        except Exception:
            return Response({"error": "An error has occurred"}, status=500)

class SuggestDepartmentView(APIView):
    """  
    Suggests department for a ticket using AI.

    @permission: IsAuthenticated  
    @method: POST - Get department suggestion  

    @request_body:  
        - ticket_id (int)  
        - description (string)  

    @return:  
        - 200: Suggested department data  
        - 400: Invalid input  
        - 500: Unexpected server error  
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ticket_id = request.data.get('ticket_id')
        description = request.data.get('description', '')
        response_data, status_code = suggest_department(ticket_id, description)
        return Response(response_data, status=status_code)