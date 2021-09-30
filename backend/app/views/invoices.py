from app.filters import InvoiceFilter
from rest_framework import viewsets
from app.serializers import InvoiceSerializer
from app.models import Invoice
from app.permissions import GetOnlyIfNotAdmin 

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = ['customer__first_name', 'customer__last_name']
    filterset_class = InvoiceFilter
    ordering_fields = '__all__'
