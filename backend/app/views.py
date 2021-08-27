from app.serializers import CustomerSerializer, EmployeeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from app.models import Customer, Employee

from rest_framework.decorators import api_view
from rest_framework.response import Response

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
