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
    http_method_names = ['get', 'post', 'patch', 'delete']
