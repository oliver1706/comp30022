from rest_framework import viewsets
from app.serializers import OrganisationSerializer
from app.models import Organisation

class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
