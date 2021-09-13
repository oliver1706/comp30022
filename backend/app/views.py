from app.serializers import CustomerSerializer, EmployeeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from app.models import Customer, Employee
from django.db.utils import IntegrityError

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.models import User

@api_view(['GET', 'HEAD'])
def index(request):
    return Response("Hello World!")

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

@api_view(['GET', 'HEAD'])
def fetch_customer(request, id):
    customer = get_object_or_404(Customer, id = id)
    serializers = CustomerSerializer(customer)
    return Response(serializers.data)

@api_view(['GET', 'HEAD'])
def fetch_employee(request, id):
    employee = get_object_or_404(Employee, id = id)
    serializers = EmployeeSerializer(employee)
    return Response(serializers.data)

@api_view(['POST'])
def create_customer(request):
    serializer = CustomerSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['POST'])
def edit_customer(request, id):
    customer = get_object_or_404(Customer, id = id)    
    serializer = CustomerSerializer(customer, request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)
    
@api_view(['POST'])
def create_employee(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        try:
            id = EmployeeSerializer.create(request.data)
        except IntegrityError:
            return Response(status = 400, data = {"username":["Another user with this username already exists."]}, content_type="application/json")
        # Fetch the created employee
        serializer = EmployeeSerializer(Employee.objects.get(id = id))
        return Response(serializer.data)
    return Response(serializer.errors)
