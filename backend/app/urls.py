from django.urls import path

from app.views import index, customers, employees

urlpatterns = [
    path('', index.index, name='index'),
    path('customers', customers.CustomerViewSet.as_view({'get': 'list'}), name = 'customers'),
    path('customers/<int:id>', customers.individual_customer, name = 'customer'),
    path('customers/create',customers.create_customer,name = 'create_customer'),
    path('employees', employees.EmployeeViewSet.as_view({'get': 'list'}), name = 'employees'),
    path('employees/<int:id>', employees.individual_employee, name = 'employee'),
    path('employees/create', employees.create_employee, name = 'create_employee')
]
