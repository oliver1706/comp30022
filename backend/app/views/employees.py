from django.contrib.auth.models import User
from app.serializers import EmployeeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from app.models import Employee
from django.db.utils import IntegrityError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from app import urls

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def destroy(self, request, pk=None):
        employee = get_object_or_404(Employee, id = pk)
        user = get_object_or_404(User, id = pk)
        employee.delete()
        user.delete()
        return Response(status=204)
