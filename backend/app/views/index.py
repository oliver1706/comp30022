from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET', 'HEAD'])
def index(request):
    return Response("Hello World!")