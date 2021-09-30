from app.permissions import GetOnlyIfNotAdmin
from rest_framework import viewsets
from app.serializers import DepartmentSerializer
from app.models import Department
from app.filters import DepartmentFilter

# Department endpoints 

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = ['name']
    filterset_class = DepartmentFilter
    ordering_fields = '__all__'
