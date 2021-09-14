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

@api_view(['POST'])
def create_employee(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        try:
            id = EmployeeSerializer.create(request.data)
        except IntegrityError:
            return Response(status = 400, data = {"username":["Another user with this username already exists."]}, content_type="application/json")
        # Fetch the created employee
        serializer = EmployeeSerializer(Employee.objects.get(id = id))
        return Response(serializer.data)
    return Response(data = serializer.errors, status = 400)

def get_employee(id):
    employee = get_object_or_404(Employee, id = id)
    serializers = EmployeeSerializer(employee)
    return Response(serializers.data)

def delete_employee(id):
    employee = get_object_or_404(Employee, id = id)
    user = get_object_or_404(User, id = id)
    employee.delete()
    user.delete()
    return Response(status = 200)

def edit_employee(request, id):
    customer = get_object_or_404(Employee, id = id) 
    serializer = EmployeeSerializer(instance = customer, data = request.data, partial = True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(data = serializer.errors, status = 400)

@api_view(['GET', 'PATCH', 'DELETE'])
def individual_employee(request, id):
    if (request.method == 'GET'):
        return get_employee(id)
    elif (request.method == 'DELETE'):
        return delete_employee(id)
    else:
        return edit_employee(request, id)