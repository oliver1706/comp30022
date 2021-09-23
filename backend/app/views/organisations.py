from rest_framework import viewsets
from app.serializers import OrganisationSerializer
from app.models import Organisation
from app.permissions import GetOnlyIfNotAdmin

class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = [GetOnlyIfNotAdmin]
    search_fields = ['name']
    filter_fields = '__all__'
    ordering_fields = '__all__'
