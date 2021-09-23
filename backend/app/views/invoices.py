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
    filter_fields = ['customer__first_name', 'customer__last_name', 'employee__id__first_name', 'employee__id__last_name', 'total_due', 'total_paid', 'date_added', 'date_due','incoming','description']
    ordering_fields = '__all__'
