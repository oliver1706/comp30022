from django.urls import path

from app.views import index, departments, organisations, customers, employees
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'departments', departments.DepartmentViewSet)
router.register(r'employees', employees.EmployeeViewSet)
router.register(r'organisations', organisations.OrganisationViewSet)
router.register(r'customers', customers.CustomerViewSet)

urlpatterns = [
    path('', index.index, name='index'),
    # Swagger endpoints
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
urlpatterns += router.urls
