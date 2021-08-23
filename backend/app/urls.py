from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('customers/', views.CustomerViewSet.as_view({'get': 'list'}), name = 'customers')
]