from app.filters import InvoiceFilter
from app.models import Invoice
from app.permissions import InvoicePermission
from app.serializers import InvoiceSerializer
from django.db.models import Avg, Max, Min, Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .utils import get_plot


class InvoiceViewSet(viewsets.ModelViewSet):
    # Invoice viewset
    # Has permission class that stipulates that only those who can edit the customer can edit invoices
    # i.e. owners and admins
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    # Must create by post on customer, as all invoices must have a customer
    http_method_names = ['get', 'patch', 'delete']
    permission_classes = [InvoicePermission]
    search_fields = ['customer__first_name', 'customer__last_name']
    filterset_class = InvoiceFilter
    ordering_fields = '__all__'

    # this function return some basic statistics(mean,min,max) of all the invoices
    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = Invoice.objects.all().aggregate(mean=Avg('total_due'),
                                                min=Min('total_due'), max=Max('total_due'))
        return Response(stats)

    # Overall plot for all invoices
    # this function return the plot in base64
    # to view in html, use <img src ="data:image/png;base64, {{chart|safe}}"
    @action(detail=False, methods=['get'])
    def salesplot(self, request):
        sales_sum = Invoice.objects.all().values(
            'date_added').annotate(sum=Sum('total_due'))
        x = [x['date_added'].date for x in sales_sum]
        y = [y['sum'] for y in sales_sum]
        print(y)
        chart = get_plot(x, y)
        return Response({'chart': chart})
