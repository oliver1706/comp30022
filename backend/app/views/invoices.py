from rest_framework import viewsets
from app.serializers import InvoiceSerializer
from app.models import Invoice
from rest_framework.authentication import TokenAuthentication
from app.permissions import GetOnlyIfNotAdmin 

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    authentication_classes = [TokenAuthentication]
    permission_classes = [GetOnlyIfNotAdmin]
