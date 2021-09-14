from rest_framework import viewsets
from app.serializers import DepartmentSerializer
from django.shortcuts import get_object_or_404
from app.models import Department

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Department endpoints 

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
