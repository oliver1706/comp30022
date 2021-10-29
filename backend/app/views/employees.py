from django.contrib.auth.models import User
from app.permissions import EmployeePermission
from app.serializers import EmployeeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from app.models import Employee
from app.filters import EmployeeFilter

from rest_framework.response import Response

# Employee viewset
# Only admins can edit other's profiles and create new employees

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    filterset_class = EmployeeFilter
    permission_classes = [EmployeePermission]
    search_fields = ['id__first_name', 'id__last_name']
    ordering_fields = '__all__'

    # As we piggyback off django's in-built user model with our customer (one to one),
    # We must override and delete both
    def destroy(self, request, pk=None):
        employee = get_object_or_404(Employee, id = pk)
        user = get_object_or_404(User, id = pk)
        employee.delete()
        user.delete()
        return Response(status=204)
