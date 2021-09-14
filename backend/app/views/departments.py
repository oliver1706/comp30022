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

@api_view(['POST'])
def create_department(request):
    serializer = DepartmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(data = serializer.errors, status = 400)

def get_department(id):
    department = get_object_or_404(Department, id = id)
    serializers = DepartmentSerializer(department)
    return Response(serializers.data)

def delete_department(id):
    department = get_object_or_404(Department, id = id)
    department.delete()
    return Response(status = 200)

def edit_department(request, id):
    department = get_object_or_404(Department, id = id) 
    serializer = DepartmentSerializer(instance = department, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(data = serializer.errors, status = 400)

@api_view(['GET', 'PATCH', 'DELETE'])
def individual_department(request, id):
    if (request.method == 'GET'):
        return get_department(id)
    elif (request.method == 'DELETE'):
        return delete_department(id)
    else:
        return edit_department(request, id)