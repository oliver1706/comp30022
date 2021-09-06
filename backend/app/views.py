from app.serializers import CustomerSerializer, EmployeeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from app.models import Customer, Employee

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

@api_view(['POST','HEAD'])
def create_customer(request):
    serializer = CustomerSerializer(data=request.data)

    if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    return Response(serializer.errors)

#Function to create employee atm
#probably have to update in future 
@api_view(['POST','HEAD'])
def create_employee(request):
    user = User.objects.create_user(
        request.data["username"],
        request.data['email'],
        request.data['password'],
        first_name= request.data['first_name'],
        last_name= request.data['last_name'],
        
    )

    user_data={
        "id":user.id,
        "job_title":request.data["job_title"],
        "phone":request.data["phone"],
        
    }
    serializer = EmployeeSerializer(data=user_data)

    if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    return Response(serializer.errors)