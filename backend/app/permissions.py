from rest_framework.permissions import BasePermission, IsAdminUser


class GetOnlyIfNotAdmin(IsAdminUser):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated
        else:
            return request.user.is_superuser


class EmployeePermission(GetOnlyIfNotAdmin):
    # Only admins can edit others' profiles and create new profiles
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if request.user.is_authenticated and request.method == 'GET':
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        if request.user.is_superuser:
            return True
        if obj.id.id == request.user.id:
            return True
        return False


class InvoicePermission(GetOnlyIfNotAdmin):
    # For already existing invoices, only admins, and owners for the customer can edit
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
    # All employees can create new customers, and watch existing ones
    # Only owners or admins can edit existing customers
    def has_permission(self, request, view):
        # Only admins can import and export data
        if "import_data" in request.path or "export_data" in request.path:
            return request.user.is_superuser
        if request.user.is_superuser:
            return True
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        # Always allowed to watch and unwatch
        if "watch" in request.path:
            return True
        if obj.is_editable(request.user):
            return True
        return False
