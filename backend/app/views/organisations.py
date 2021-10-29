from app.filters import OrganisationFilter
from app.models import Organisation
from app.permissions import GetOnlyIfNotAdmin
from app.serializers import OrganisationSerializer
from rest_framework import viewsets

# Organisation viewset
# Only admins can create or edit, employees can only view


class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = ['name']
    filterset_class = OrganisationFilter
    ordering_fields = '__all__'
