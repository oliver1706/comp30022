from app.permissions import GetOnlyIfNotAdmin
from rest_framework import viewsets
from app.serializers import DepartmentSerializer
from app.models import Department
from rest_framework.authentication import TokenAuthentication


# Department endpoints 

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    authentication_classes = [TokenAuthentication]
    permission_classes = [GetOnlyIfNotAdmin]
