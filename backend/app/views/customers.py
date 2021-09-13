from app.serializers import CustomerSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from app.models import Customer

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Customer endpoints

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

@api_view(['POST'])
def create_customer(request):
    serializer = CustomerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

def get_customer(id):
    customer = get_object_or_404(Customer, id = id)
    serializers = CustomerSerializer(customer)
    return Response(serializers.data)

def edit_customer(request, id):
    customer = get_object_or_404(Customer, id = id) 
    serializer = CustomerSerializer(instance = customer, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['GET', 'PATCH'])
def individual_customer(request, id):
    if (request.method == 'GET'):
        return get_customer(id)
    else:
        return edit_customer(request, id)