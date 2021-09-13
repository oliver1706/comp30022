from django.urls import path

from app.views import index, departments, customers, employees

urlpatterns = [
    path('', index.index, name='index'),
    # department endpoints
    path('departments', departments.DepartmentViewSet.as_view({'get': 'list'}), name = 'department'),
    path('departments/<int:id>', departments.individual_department, name = 'department'),
    path('departments/create', departments.create_department, name = 'create_department'),
    # customer endpoints
    path('customers', customers.CustomerViewSet.as_view({'get': 'list'}), name = 'customers'),
    path('customers/<int:id>', customers.individual_customer, name = 'customer'),
    path('customers/create',customers.create_customer,name = 'create_customer'),
    # employee endpoints
    path('employees', employees.EmployeeViewSet.as_view({'get': 'list'}), name = 'employees'),
    path('employees/<int:id>', employees.individual_employee, name = 'employee'),
    path('employees/create', employees.create_employee, name = 'create_employee')
]
