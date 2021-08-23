from app.serializers import CustomerSerializer
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from app.models import Customer
# Create your views here.

from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world!")

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
