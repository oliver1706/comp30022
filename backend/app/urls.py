from django.urls import path

from app.views import index, departments, organisations, customers, employees
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'departments', departments.DepartmentViewSet)
router.register(r'employees', employees.EmployeeViewSet)

urlpatterns = [
    path('', index.index, name='index'),
    # organisation endpoints
    path('organisations', organisations.OrganisationViewSet.as_view({'get': 'list'}), name = 'organisations'),
    path('organisations/<int:id>', organisations.individual_organisation, name = 'organisations'),
    path('organisations/create', organisations.create_organisation, name = 'create_organisations'),
    # customer endpoints
    path('customers', customers.CustomerViewSet.as_view({'get': 'list'}), name = 'customers'),
    path('customers/<int:id>', customers.individual_customer, name = 'customer'),
    path('customers/create',customers.create_customer,name = 'create_customer'),
    # Swagger endpoints
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
urlpatterns += router.urls
