from rest_framework import serializers
from api.models import Department
"""  
    Serializes Department model data for API responses.

Fields:
    - id: Department ID
    - name: Department name"
"""
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name"]
