from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.models import Department
from api.DepartmentSuggestionAI import suggest_department

class DepartmentsListView(APIView):
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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ticket_id = request.data.get('ticket_id')
        description = request.data.get('description', '')
        response_data, status_code = suggest_department(ticket_id, description)
        return Response(response_data, status=status_code)
