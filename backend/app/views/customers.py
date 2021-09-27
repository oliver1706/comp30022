from app.serializers import CustomerSerializer, InvoiceSerializer
from rest_framework import viewsets
from app.models import Customer, Department, Invoice
from django.http.response import HttpResponse
from import_export import fields, resources
import tablib
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

    @action(detail = False, methods=["GET"])
    def export_data(self, request):
        queryset = self.get_queryset()
        filter_queryset = self.filter_queryset(queryset)
        resource = CustomerResource()
        data = resource.export(filter_queryset)
        return HttpResponse(data.json)

    @action(detail = False, methods=["POST"])
    def import_data(self, request):
        resource = CustomerResource()
        dataset = tablib.Dataset()
        dataset.load(request.body, format="json")
        result = resource.import_data(dataset, dry_run=False, raise_errors=True)
        return HttpResponse(result.total_rows)


class CustomerResource(resources.ModelResource):

    def import_obj(self, instance, row, dry_run, **kwargs):
        super(CustomerResource, self).import_obj(instance, row, dry_run)
        department_name = row["department_name"]
        if department_name != None:
            department, _ = Department.objects.get_or_create(name = department_name)
            instance.department = department

    invoices = fields.Field()
    def dehydrate_invoices(self, obj):
        invoices = Invoice.objects.filter(customer=obj)
        serializer = InvoiceSerializer(invoices, many=True)
        return serializer.data
    department_name = fields.Field()
    def dehydrate_department_name(self, obj):
        department = obj.department
        if department == None:
            return None
        else:
            return department.name
    class Meta:
        exclude = ('department', 'organisation')
        model = Customer