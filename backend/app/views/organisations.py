from rest_framework import viewsets
from app.serializers import OrganisationSerializer
from app.models import Organisation
from app.permissions import GetOnlyIfNotAdmin
from app.filters import OrganisationFilter

class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = ['name']
    filterset_class = OrganisationFilter
    ordering_fields = '__all__'
