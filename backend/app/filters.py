from app.models import Customer, Employee, Invoice
from django_filters.rest_framework import FilterSet
from django_filters.filters import CharFilter, NumberFilter

class OrganisationFilter(FilterSet):
    name = CharFilter(lookup_expr='icontains')

class DepartmentFilter(FilterSet):
    name = CharFilter(lookup_expr='icontains')

class CustomerFilter(FilterSet):
    department = CharFilter('department__name', 'icontains')
    organisation = CharFilter('organisation__name', 'icontains')
    description = CharFilter(lookup_expr='icontains')
    job_title = CharFilter(lookup_expr='icontains')
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'gender', 'tag', 'email', 'phone']
        

class EmployeeFilter(FilterSet):
    id = CharFilter('id__id')
    first_name = CharFilter('id__first_name')
    last_name = CharFilter('id__last_name')
    username = CharFilter('id__username')
    email = CharFilter('id__email')
    job_title = CharFilter(lookup_expr='icontains')
    class Meta:
        model = Employee
        fields = ['phone']

class InvoiceFilter(FilterSet):
    description = CharFilter(lookup_expr='icontains')
    employee__first_name = CharFilter('employee__id__first_name')
    employee__last_name = CharFilter('employee__id__last_name')
    paid_min = NumberFilter('total_paid', 'gte')
    paid_max = NumberFilter('total_paid', 'lte')
    class Meta:
        model = Invoice
        fields = ['id', 'customer__first_name', 'customer__last_name', 'total_due',
         'total_paid', 'date_added', 'date_due', 'incoming']
