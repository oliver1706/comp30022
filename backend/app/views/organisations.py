from rest_framework import viewsets
from app.serializers import OrganisationSerializer
from django.shortcuts import get_object_or_404
from app.models import Organisation

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Organisation endpoints 

class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer

@api_view(['POST'])
def create_organisation(request):
    serializer = OrganisationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(data = serializer.errors, status = 400)

def get_organisation(id):
    organisation = get_object_or_404(Organisation, id = id)
    serializers = OrganisationSerializer(organisation)
    return Response(serializers.data)

def delete_organisation(id):
    organisation = get_object_or_404(Organisation, id = id)
    organisation.delete()
    return Response(status = 200)

def edit_organisation(request, id):
    organisation = get_object_or_404(Organisation, id = id) 
    serializer = OrganisationSerializer(instance = organisation, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(data = serializer.errors, status = 400)

@api_view(['GET', 'PATCH', 'DELETE'])
def individual_organisation(request, id):
    if (request.method == 'GET'):
        return get_organisation(id)
    elif (request.method == 'DELETE'):
        return delete_organisation(id)
    else:
        return edit_organisation(request, id)