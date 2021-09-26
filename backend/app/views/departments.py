from django.http.response import HttpResponse
from app.permissions import GetOnlyIfNotAdmin
from rest_framework import fields, viewsets
from app.serializers import DepartmentSerializer
from app.models import Department
from rest_framework.decorators import action
from import_export import resources
import tablib

# Department endpoints 

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = ['name']
    filter_fields = '__all__'
    ordering_fields = '__all__'

    @action(detail = False, methods=["GET"])
    def export_data(self, request):
        queryset = self.get_queryset()
        filter_queryset = self.filter_queryset(queryset)
        resource = resources.modelresource_factory(model=Department)()
        data = resource.export(filter_queryset)
        return HttpResponse(data.json)

    @action(detail = False, methods=["POST"])
    def import_data(self, request):
        resource = resources.modelresource_factory(model=Department)()
        dataset = tablib.Dataset()
        dataset.load(request.body, format="json")
        result = resource.import_data(dataset, dry_run=False, raise_errors=True)
        return HttpResponse(result.total_rows)
