from app.serializers import CustomerSerializer
from django.shortcuts import render
from rest_framework import viewsets,status
from rest_framework import permissions
from app.models import Customer

from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.

from django.http import HttpResponse, response


def index(request):
    return HttpResponse("Hello, world!")

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


@api_view(('GET',))
def singleCustomer(request,id):
    try:
        singleCustomer= Customer.objects.get(id= id)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializers = CustomerSerializer(singleCustomer)
    return Response(serializers.data)
