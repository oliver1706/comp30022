from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from app.serializers import CustomerSerializer, InvoiceSerializer
from rest_framework import viewsets
from app.models import Customer, CustomerOwner, CustomerWatcher, Department, Employee, Invoice
from django.http.response import HttpResponse, HttpResponseForbidden, JsonResponse
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

    @action(detail=True, methods=["POST"])
    def watch(self, request, pk=None):
        employee_id = request.user.id
        if employee_id != None and not self.get_object().is_watcher(employee_id):
            customer_watcher = CustomerWatcher.objects.create(customer = self.get_object(), employee = get_object_or_404(Employee, pk = employee_id))
            customer_watcher.save()
        return HttpResponse()

    @action(detail = True, methods=["GET"])
    def get_watchers(self, request, pk=None):
        customer_watchers = CustomerWatcher.objects.filter(customer = pk)
        employee_ids = list(customer_watchers.values_list('employee', flat=True))
        return JsonResponse(employee_ids, safe=False)

    @action(detail=True, methods=["POST"])
    def add_owners(self, request, pk=None):
        customer = self.get_object()
        # Only owners or admins can add owners
        if not (customer.is_owner(request.user.id) or request.user.is_superuser()):
            return HttpResponseForbidden()
        data = request.data
        if type(data) != list:
            raise ValidationError("Body must be a list of integers.")
        for employee_id in request.data:
            if type(employee_id) != int:
                raise ValidationError("Body must be a list of integers.")
        for employee_id in request.data:
            if customer.is_owner(employee_id):
                continue
            customer_owner = CustomerOwner.objects.create(customer = customer, employee = get_object_or_404(Employee, pk = employee_id))
            customer_owner.save()
        return HttpResponse()
    
    @action(detail = True, methods=["GET"])
    def get_owners(self, request, pk=None):
        customer_owners = CustomerOwner.objects.filter(customer = pk)
        employee_ids = list(customer_owners.values_list('employee', flat=True))
        return JsonResponse(employee_ids, safe=False)
    
    def update_watchers(instance):
        return

class CustomerResource(resources.ModelResource):

    def import_obj(self, instance, row, dry_run, **kwargs):
        # Call super
        super(CustomerResource, self).import_obj(instance, row, dry_run)
        # If we have a non-null departments or organisations, either find or create it and assign to the instance
        department_name = row["department_name"]
        if department_name != None:
            department, _ = Department.objects.get_or_create(name = department_name)
            instance.department = department
        organisation_name = row["organisation_name"]
        if organisation_name != None:
            organisation, _ = Department.objects.get_or_create(name = organisation_name)
            instance.organisation = organisation
        instance.save()

        # Create all of the invoices
        invoices = row["invoices"]
        for i in invoices:        
            invoice = Invoice.objects.create(customer = instance, **i)
            invoice.save()

    # We don't want any id, as this would override existing customers
    id = fields.Field()
    def dehydrate_id(self, obj):
        return None

    # Return json representation of invoices with no employee id
    invoices = fields.Field()
    def dehydrate_invoices(self, obj):
        invoices = Invoice.objects.filter(customer=obj)
        serializer = InvoiceSerializer(invoices, many=True)
        data = serializer.data
        for invoice in data:
            invoice["employee"] = None
        return data

    department_name = fields.Field()
    def dehydrate_department_name(self, obj):
        department = obj.department
        if department == None:
            return None
        else:
            return department.name

    organisation_name = fields.Field()
    def dehydrate_organisation_name(self, obj):
        organisation = obj.organisation
        if organisation == None:
            return None
        else:
            return organisation.name
    class Meta:
        exclude = ('department', 'organisation')
        model = Customer
