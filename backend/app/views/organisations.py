from rest_framework import viewsets
from app.serializers import OrganisationSerializer
from app.models import Organisation
from rest_framework.authentication import TokenAuthentication
from app.permissions import GetOnlyIfNotAdmin

class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    authentication_classes = [TokenAuthentication]
    permission_classes = [GetOnlyIfNotAdmin]
