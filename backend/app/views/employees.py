from django.contrib.auth.models import User
from django_filters import filterset
from app.serializers import EmployeeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from app.models import Employee
#from app.filters import

from rest_framework.response import Response


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    search_fields = ['id__first_name', 'id__last_name']
    #filterset_class = 
    ordering_fields = '__all__'

    def destroy(self, request, pk=None):
        employee = get_object_or_404(Employee, id = pk)
        user = get_object_or_404(User, id = pk)
        employee.delete()
        user.delete()
        return Response(status=204)
