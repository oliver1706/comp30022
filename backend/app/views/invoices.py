from rest_framework import viewsets
from app.serializers import InvoiceSerializer
from app.models import Invoice
from app.permissions import GetOnlyIfNotAdmin 

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = '__all__'
    filter_fields = '__all__'
    ordering_fields = '__all__'
