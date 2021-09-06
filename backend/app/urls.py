from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('customers/', views.CustomerViewSet.as_view({'get': 'list'}), name = 'customers'),
    path('customers/<int:id>/', views.fetch_customer, name = 'employee'),
    path('employees/', views.EmployeeViewSet.as_view({'get': 'list'}), name = 'employees'),
    path('employees/<int:id>/', views.fetch_employee, name = 'employee'),
    path('customers/create/',views.create_customer,name = 'create_customer'),
    path('employees/create/',views.create_employee,name='create_customer')
]
