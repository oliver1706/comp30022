from django.shortcuts import get_object_or_404
from rest_framework import response, serializers
from rest_framework.permissions import IsAuthenticated
from app.permissions import CustomerPermission
from app.serializers import CustomerSerializer, EmployeeIdsSerializer, InvoiceSerializer
from rest_framework import viewsets
from app.models import Customer, CustomerOwner, CustomerWatcher, Department, Employee, Invoice
from django.http.response import HttpResponse, HttpResponseForbidden, JsonResponse
from import_export import fields, resources
import tablib
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from app.filters import CustomerFilter
# Customer endpoints

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [CustomerPermission]
    search_fields = ['first_name', 'last_name']
    filterset_class = CustomerFilter
    ordering_fields =['description', 'first_name', 'last_name', 'job_title', 'gender', 'tag', 'email', 'phone', 'department__name', 'organisation__name']
    
    @extend_schema(
        responses=InvoiceSerializer(many=True)
    )
    @action(detail=True, methods = ['get'])
    def invoices(self, request, pk=None):
        invoices = Invoice.objects.filter(customer=pk)
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        request=InvoiceSerializer,
        responses=InvoiceSerializer
    )
    @action(detail=True, methods=["POST"])
    def invoice(self, request, pk=None):
        customer = get_object_or_404(Customer, pk=pk)
        self.check_object_permissions(request, obj = customer)
        request.data._mutable = True
        request.data["customer"] = pk
        request.data._mutable = False
        serializer = InvoiceSerializer(data = request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        invoice = serializer.create(serializer.validated_data)

        serializer = InvoiceSerializer(invoice)
        return JsonResponse(serializer.data)

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

    @action(detail=True, methods=["POST"])
    def unwatch(self, request, pk=None):
        employee_id = request.user.id
        if employee_id != None and self.get_object().is_watcher(employee_id):
            customer_watcher = CustomerWatcher.objects.get(customer = self.get_object(), employee = get_object_or_404(Employee, pk = employee_id))
            customer_watcher.delete()
        return HttpResponse()

    
    @extend_schema(
        request=EmployeeIdsSerializer,
        responses=EmployeeIdsSerializer
        )
    @action(detail = True, methods=["GET"])
    def watchers(self, request, pk=None):
        customer = Customer.objects.get(id = pk)
        serializer = EmployeeIdsSerializer(data = customer.get_watchers())
        serializer.is_valid()
        return JsonResponse(serializer.validated_data)

    @extend_schema(
        request=EmployeeIdsSerializer,
        responses=EmployeeIdsSerializer
        )
    @action(detail=True, methods=["POST"])
    def add_owners(self, request, pk=None):
        customer = self.get_object()
        # Only owners or admins can add owners
        if not (customer.is_owner(request.user.id) or request.user.is_superuser):
            return HttpResponseForbidden()
        serializer = EmployeeIdsSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        for employee_id in serializer.validated_data.get("employee_ids"):
            if not Employee.objects.filter(id = employee_id).exists() or customer.is_owner(employee_id):
                continue
            customer_owner = CustomerOwner.objects.create(customer = customer, employee = get_object_or_404(Employee, pk = employee_id))
            customer_owner.save()
        serializer = EmployeeIdsSerializer(data = customer.get_owners())
        serializer.is_valid()
        return JsonResponse(serializer.validated_data)
    
    @extend_schema(
    request=EmployeeIdsSerializer,
    responses=EmployeeIdsSerializer
    )
    @action(detail=True, methods=["POST"])
    def remove_owners(self, request, pk=None):
        customer = self.get_object()
        # Only owners or admins can add owners
        if not (customer.is_owner(request.user.id) or request.user.is_superuser):
            return HttpResponseForbidden()
        serializer = EmployeeIdsSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        for employee_id in serializer.validated_data.get("employee_ids"):
            if not Employee.objects.filter(id = employee_id).exists() or not customer.is_owner(employee_id):
                continue
            customer_owner = CustomerOwner.objects.get(customer = customer, employee = get_object_or_404(Employee, pk = employee_id))
            customer_owner.delete()
        current_owners = CustomerOwner.objects.filter(customer = pk).values_list('employee_id', flat=True)
        serializer = EmployeeIdsSerializer(data = customer.get_owners())
        serializer.is_valid()
        return JsonResponse(serializer.validated_data)

    @extend_schema(
        request=EmployeeIdsSerializer,
        responses=EmployeeIdsSerializer
    )
    @action(detail = True, methods=["GET"])
    def owners(self, request, pk=None):
        customer = Customer.objects.get(id = pk)
        serializer = EmployeeIdsSerializer(data = customer.get_owners())
        serializer.is_valid()
        return JsonResponse(serializer.validated_data)
    

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
