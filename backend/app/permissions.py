from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAdminUser

class GetOnlyIfNotAdmin(IsAdminUser):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated
        else:
            return request.user.is_superuser

# Can only edit your own employee profile unless you are admin
class EmployeePermission(GetOnlyIfNotAdmin):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if request.user.is_authenticated:
            return True
        return False
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        if request.user.is_superuser:
            return True
        if obj.id == request.user.id:
            return True
        return False

class InvoicePermission(GetOnlyIfNotAdmin):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if request.user.is_authenticated:
            return True
        return False
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        if obj.customer.is_editable(request.user):
            return True
        return False

class CustomerPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if request.user.is_authenticated:
            return True
        return False
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        if "watch" in request.path:
            return True
        if obj.is_editable(request.user):
            return True
        return False
