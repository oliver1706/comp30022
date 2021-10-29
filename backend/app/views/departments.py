from app.filters import DepartmentFilter
from app.models import Department
from app.permissions import GetOnlyIfNotAdmin
from app.serializers import DepartmentSerializer
from rest_framework import viewsets


class DepartmentViewSet(viewsets.ModelViewSet):
    # Department viewset
    # Only admins can create or edit, employees can only view
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = ['name']
    filterset_class = DepartmentFilter
    ordering_fields = '__all__'
