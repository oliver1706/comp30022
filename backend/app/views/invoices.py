from rest_framework.response import Response
from app.filters import InvoiceFilter
from rest_framework import viewsets
from app.serializers import InvoiceSerializer
from app.models import Invoice
from app.permissions import GetOnlyIfNotAdmin 

from django.db.models import Avg, Min, Max
from rest_framework.response import Response

from rest_framework.decorators import action
class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = ['customer__first_name', 'customer__last_name']
    filterset_class = InvoiceFilter
    ordering_fields = '__all__'

    @action(detail=False, methods = ['get'])
    def stats(self, request, pk=None):
        
        stats=Invoice.objects.all().aggregate(mean=Avg('total_due'),min=Min('total_due'),max= Max('total_due'))
        return Response(stats)
