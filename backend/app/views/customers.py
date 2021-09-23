from app.serializers import CustomerSerializer, InvoiceSerializer
from rest_framework import viewsets
from app.models import Customer, Invoice

from rest_framework.decorators import action
from rest_framework.response import Response

# Customer endpoints

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    search_fields = ['first_name', 'last_name']
    filter_fields = ['description', 'first_name', 'last_name', 'job_title', 'email', 'phone', 'department__name', 'organisation__name']
    ordering_fields =['description', 'first_name', 'last_name', 'job_title', 'email', 'phone', 'department__name', 'organisation__name']

    @action(detail=True, methods = ['get'])
    def invoices(self, request, pk=None):
        invoices = Invoice.objects.filter(customer=pk)
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)
