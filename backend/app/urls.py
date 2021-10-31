from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.urls import path
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)
from rest_framework import routers

from app.views import (customers, departments, employees, index, invoices,
                       organisations)

router = routers.SimpleRouter()
router.register(r'departments', departments.DepartmentViewSet)
router.register(r'employees', employees.EmployeeViewSet)
router.register(r'organisations', organisations.OrganisationViewSet)
router.register(r'customers', customers.CustomerViewSet)
router.register(r'invoices', invoices.InvoiceViewSet)

urlpatterns = [
    path('', index.index, name='index'),
    # Swagger endpoints
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/',
         SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path(r'accounts/', include('rest_auth.urls'))
]
urlpatterns += router.urls
