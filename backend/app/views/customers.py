import base64

import requests
import tablib
from app.filters import CustomerFilter
from app.models import (Customer, CustomerOwner, CustomerWatcher, Department,
                        Employee, Invoice, Organisation)
from app.permissions import CustomerPermission
from app.serializers import (CustomerSerializer, EmployeeIdsSerializer,
                             InvoiceSerializer)
from django.core.files.base import ContentFile
from django.db.models import Avg, Sum
from django.db.models.functions import Trunc
from django.http.response import (HttpResponse, HttpResponseForbidden,
                                  JsonResponse)
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from import_export import fields, resources
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .utils import get_plot


class CustomerViewSet(viewsets.ModelViewSet):
    # Customer endpoints
    # Has permission class such that only admins and owners can edit, others can only view or "watch" (be notified about changes to the item)
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [CustomerPermission]
    search_fields = ['first_name', 'last_name']
    filterset_class = CustomerFilter
    ordering_fields = ['description', 'first_name', 'last_name', 'job_title', 'gender', 'tag', 'email', 'phone',
                       'department__name', 'organisation__name']

    # Can't order and filter on serializer method fields by default, override
    def list(self, request, *args, **kwargs):
        customers = Customer.objects.all()
        # Effectively call super, so default's (ordering_fields, CustomerFilter etc.) work
        customers = self.filter_queryset(customers)
        # Ability to filter on is_owner
        is_owner = request.query_params.get('is_owner')
        if not is_owner is None:
            if is_owner.lower() == "true":
                customers = list(
                    filter(lambda c: c.is_owner(request.user.id), customers))
            elif is_owner.lower() == "false":
                customers = list(
                    filter(lambda c: not c.is_owner(request.user.id), customers))
        # Whether or no the employee is watching the customer
        is_watcher = request.query_params.get('is_watcher')
        if not is_watcher is None:
            if is_watcher.lower() == "true":
                customers = list(
                    filter(lambda c: c.is_watcher(request.user.id), customers))
            elif is_watcher.lower() == "false":
                customers = list(
                    filter(lambda c: not c.is_watcher(request.user.id), customers))
        # Ordering
        ordering = request.query_params.get('ordering')
        # If the ordering field is preceded by a - (minus symbol), reverse the order, e.g. -total_invoice = largest first
        reverse = False
        if not ordering is None and ordering[0] == '-':
            reverse = True
            ordering = ordering[1:]

        if not ordering is None and not ordering in self.ordering_fields:
            if ordering == "average_invoice":
                customers = sorted(
                    customers, key=lambda c: c.get_average_invoice_or_zero(), reverse=reverse)
            if ordering == "total_invoice":
                customers = sorted(
                    customers, key=lambda c: c.get_total_invoice(), reverse=reverse)
            if ordering == "total_paid":
                customers = sorted(
                    customers, key=lambda c: c.get_total_paid(), reverse=reverse)
            if ordering == "total_overdue":
                customers = sorted(
                    customers, key=lambda c: c.get_total_overdue(), reverse=reverse)

        # Code to enable pagination
        page = self.paginate_queryset(customers)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(customers, many=True)
        return Response(serializer.data)

    # Return all associated invoices
    @extend_schema(
        responses=InvoiceSerializer(many=True)
    )
    @action(detail=True, methods=['get'])
    def invoices(self, request, pk=None):
        invoices = Invoice.objects.filter(customer=pk)
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

    # Create a new invoice
    @extend_schema(
        request=InvoiceSerializer,
        responses=InvoiceSerializer
    )
    @action(detail=True, methods=["POST"])
    def invoice(self, request, pk=None):
        customer = get_object_or_404(Customer, pk=pk)
        # This workaround is necessary to make sure that the customer in the data is the customer in the url
        # And that the employee has permission to edit them
        self.check_object_permissions(request, obj=customer)
        request.data._mutable = True
        request.data["customer"] = pk
        request.data._mutable = False
        serializer = InvoiceSerializer(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        invoice = serializer.create(serializer.validated_data)

        serializer = InvoiceSerializer(invoice)
        return JsonResponse(serializer.data)

    # Returns a textual (JSON) representation of all currently selected customers in the database
    # This means they can be filtered just like a normal search, with query parameters
    @action(detail=False, methods=["GET"])
    def export_data(self, request):
        queryset = self.get_queryset()
        filter_queryset = self.filter_queryset(queryset)
        resource = CustomerResource()
        data = resource.export(filter_queryset)
        return HttpResponse(data.json)

    # Import from the request body a json list of customers
    @action(detail=False, methods=["POST"])
    def import_data(self, request):
        resource = CustomerResource()
        dataset = tablib.Dataset()
        dataset.load(request.body, format="json")
        result = resource.import_data(
            dataset, dry_run=False, raise_errors=True)
        return HttpResponse(result.total_rows)

    # Import from a file in the request a list of customers
    @action(detail=False, methods=["POST"])
    def import_data_file(self, request):
        resource = CustomerResource()
        dataset = tablib.Dataset()
        dataset.load(request.data["file"], format="json")
        result = resource.import_data(
            dataset, dry_run=False, raise_errors=True)
        return HttpResponse(result.total_rows)

    # Watch the employee so you can be notified about all actions
    @action(detail=True, methods=["POST"])
    def watch(self, request, pk=None):
        employee_id = request.user.id
        if employee_id != None and not self.get_object().is_watcher(employee_id):
            customer_watcher = CustomerWatcher.objects.create(
                customer=self.get_object(), employee=get_object_or_404(Employee, pk=employee_id))
            customer_watcher.save()
        return HttpResponse()

    # Unwatch the employee
    @action(detail=True, methods=["POST"])
    def unwatch(self, request, pk=None):
        employee_id = request.user.id
        if employee_id != None and self.get_object().is_watcher(employee_id):
            customer_watcher = CustomerWatcher.objects.get(
                customer=self.get_object(), employee=get_object_or_404(Employee, pk=employee_id))
            customer_watcher.delete()
        return HttpResponse()

    # Return a list of all the ids of employees currently watching this customer
    @extend_schema(
        request=EmployeeIdsSerializer,
        responses=EmployeeIdsSerializer
    )
    @action(detail=True, methods=["GET"])
    def watchers(self, request, pk=None):
        customer = Customer.objects.get(id=pk)
        serializer = EmployeeIdsSerializer(data=customer.get_watchers())
        serializer.is_valid()
        return JsonResponse(serializer.validated_data)

    # Take a list of employee ids and add them all as owners
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
        serializer = EmployeeIdsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        for employee_id in serializer.validated_data.get("employee_ids"):
            if not Employee.objects.filter(id=employee_id).exists() or customer.is_owner(employee_id):
                continue
            customer_owner = CustomerOwner.objects.create(
                customer=customer, employee=get_object_or_404(Employee, pk=employee_id))
            customer_owner.save()
        # Return the (presumably expanded) list of current owners
        serializer = EmployeeIdsSerializer(data=customer.get_owners())
        serializer.is_valid()
        return JsonResponse(serializer.validated_data)

    # Takes a list of employee ids and remove them all as owners
    @extend_schema(
        request=EmployeeIdsSerializer,
        responses=EmployeeIdsSerializer
    )
    @action(detail=True, methods=["POST"])
    def remove_owners(self, request, pk=None):
        customer = self.get_object()
        # Only owners or admins can remove owners
        if not (customer.is_owner(request.user.id) or request.user.is_superuser):
            return HttpResponseForbidden()
        serializer = EmployeeIdsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        for employee_id in serializer.validated_data.get("employee_ids"):
            if not Employee.objects.filter(id=employee_id).exists() or not customer.is_owner(employee_id):
                continue
            customer_owner = CustomerOwner.objects.get(
                customer=customer, employee=get_object_or_404(Employee, pk=employee_id))
            customer_owner.delete()
        # Return new list of owners
        serializer = EmployeeIdsSerializer(data=customer.get_owners())
        serializer.is_valid()
        return JsonResponse(serializer.validated_data)

    # Return graphs for customer
    @action(detail=True, methods=['get'])
    def salesplot(self, request, pk=None):
        # this function return the plot in base64
        # to view in html, use <img src ="data:image/png;base64, {{chart|safe}}"
        # Total invoice amount per year
        invoices = Invoice.objects.filter(customer=pk)
        sales_sum = invoices.annotate(year=Trunc('date_added', 'year')).values(
            'year').annotate(sum=Sum('total_due')).order_by()
        x = [x['year'].strftime('%Y') for x in sales_sum]
        sum_y = [y['sum'] for y in sales_sum]
        sum_of_sales_plot = get_plot(
            x, sum_y, "Total Invoice Amount per Year", "Year", "Sales")

        # average amount of invoices per year
        sales_mean = invoices.annotate(year=Trunc('date_added', 'year')).values(
            'year').annotate(mean=Avg('total_due')).order_by()
        mean_y = [y['mean'] for y in sales_mean]
        mean_of_sales_plot = get_plot(
            x, mean_y, "Average Invoice Amount per Year", "Year", "Sales")

        # Plot of actual invoices
        invoice_amount = invoices.values(
            'total_due', 'date_added').order_by('date_added')
        invoice_y = [y['total_due'] for y in invoice_amount]
        invoice_x = [x['date_added'].strftime(
            '%d %b %Y') for x in invoice_amount]
        amount_per_invoices = get_plot(
            invoice_x, invoice_y, "Amount per Invoice", "Date", "Sales")
        return Response({'sum_of_sales_plot': sum_of_sales_plot, 'mean_of_sales_plot': mean_of_sales_plot, 'amount_per_invoices': amount_per_invoices})


class CustomerResource(resources.ModelResource):
    # This class is the customer representation that is imported and exported through django-import-export

    # This overridden function is called for each customer in the json
    def import_obj(self, instance, row, dry_run, **kwargs):
        # Call super
        super(CustomerResource, self).import_obj(instance, row, dry_run)
        # If we have a non-null departments or organisations, either find or create it and assign to the instance
        department_name = row["department_name"]
        if department_name != None:
            department, _ = Department.objects.get_or_create(
                name=department_name)
            instance.department = department
        organisation_name = row["organisation_name"]
        if organisation_name != None:
            organisation, _ = Organisation.objects.get_or_create(
                name=organisation_name)
            instance.organisation = organisation
        # Convert base64 representation of photo to an actual photo
        photo_base64 = row["photo"]
        if photo_base64 != None:
            instance.photo.save("unknown.png", ContentFile(
                base64.b64decode(photo_base64)), save=True)
        instance.save()

        # Create all of the invoices
        invoices = row["invoices"]
        for i in invoices:
            pdf_base64 = i["pdf"]
            del i["pdf"]
            invoice = Invoice.objects.create(customer=instance, **i)
            # Convert base64 representation of pdf to actual pdf
            if pdf_base64 != None:
                invoice.pdf.save("unknown.pdf", ContentFile(
                    base64.b64decode(pdf_base64)), save=True)
            invoice.save()

    # The dehydrate functions are for converting the object into json/text

    # All ids are null to avoid overwriting existing customers
    id = fields.Field()

    def dehydrate_id(self, obj):
        return None

    # Convert all invoices into an array
    invoices = fields.Field()

    def dehydrate_invoices(self, obj):
        invoices = Invoice.objects.filter(customer=obj)
        serializer = InvoiceSerializer(invoices, many=True)
        data = serializer.data
        for invoice in data:
            # Remove employee as only admin should be an owner
            del invoice["employee"]
            # Remove customer as their id may change upon import
            del invoice["customer"]
            invoice["id"] = None
            # Retrieve pdf and convert to base64
            pdf_url = invoice["pdf"]
            if pdf_url != None:
                url = obj.photo.url
                response = requests.get(url)
                if not response.ok:
                    invoice["pdf"] = None
                invoice["pdf"] = base64.b64encode(
                    response.content).decode('ascii')
        return data

    # Give us the department_name, not the id
    department_name = fields.Field()

    def dehydrate_department_name(self, obj):
        department = obj.department
        if department == None:
            return None
        else:
            return department.name

    # organisation_name, not the id
    organisation_name = fields.Field()

    def dehydrate_organisation_name(self, obj):
        organisation = obj.organisation
        if organisation == None:
            return None
        else:
            return organisation.name

    # Retrieve photo from s3 and encode in base64
    photo = fields.Field()

    def dehydrate_photo(self, obj):
        if obj.photo and hasattr(obj.photo, 'url'):
            url = obj.photo.url
            response = requests.get(url)
            if not response.ok:
                return None
            return base64.b64encode(response.content).decode('ascii')
        else:
            return None

    class Meta:
        exclude = ('department', 'organisation', 'photo')
        import_id_fields = []
        skip_diff = True
        model = Customer
