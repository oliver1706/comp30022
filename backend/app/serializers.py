from django.contrib.auth.models import User
from rest_framework import serializers

from app.models import (Customer, CustomerOwner, CustomerWatcher, Department,
                        Employee, Invoice, Organisation)
from app.views.utils import update_department_id, update_organisation_id


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ("id", "job_title", "phone", "username", "first_name", "last_name",
                  "email", "password", "photo", "department", "department_name", "admin")
    # As employee piggybacks off Django's in-built user model, we have to explicitly grab from its id/the user
    # Extant fields like the username, email etc.
    id = serializers.PrimaryKeyRelatedField(source="id.id", read_only=True)
    username = serializers.CharField(source="id.username")
    # Write_only, don't display the hashed password ever. It also can't be edited during patching.
    # Instead there are accounts endpoints that can be called.
    password = serializers.CharField(
        source="id.password", write_only=True, required=True)
    first_name = serializers.CharField(source="id.first_name")
    last_name = serializers.CharField(source="id.last_name")
    email = serializers.EmailField(source="id.email")
    # Department is write_only as we take in an integer for the department to set,
    # And display the name
    department = serializers.IntegerField(
        write_only=True, allow_null=True, required=False)
    department_name = serializers.CharField(
        source="department.name", read_only=True, required=False)
    admin = serializers.BooleanField(source="id.is_superuser", read_only=True)

    def create(self, validated_data):
        # Special create method needed for handling the user
        user = User.objects.create_user(validated_data.get("id").get("username"), validated_data.get(
            "id").get("email"), validated_data.get("id").get("password"))
        user.first_name = validated_data.get("id").get("first_name")
        user.last_name = validated_data.get("id").get("last_name")
        user.save()

        employee = Employee.objects.create(id=user, job_title=validated_data.get("job_title"),
                                           phone=validated_data.get("phone"), photo=validated_data.get("photo"))
        update_department_id(employee, validated_data)
        employee.save()

        return employee

    def create_superuser(self, validated_data):
        # This method is not exposed anywhere, and will only be used from the Django shell
        # As outlined in the README.md
        user = User.objects.create_superuser(validated_data.get(
            "username"), validated_data.get("email"), validated_data.get("password"))
        user.first_name = validated_data.get("first_name")
        user.last_name = validated_data.get("last_name")
        user.save()

        employee = Employee.objects.create(id=user, job_title=validated_data.get("job_title"),
                                           phone=validated_data.get("phone"), photo=validated_data.get("photo"))
        update_department_id(employee, validated_data)
        employee.save()

        return employee

    def update(self, instance, validated_data):
        user = instance.id
        user.first_name = validated_data.get(
            "id", {}).get("first_name", user.first_name)
        user.last_name = validated_data.get(
            "id", {}).get("last_name", user.last_name)
        user.email = validated_data.get("id", {}).get("email", user.email)
        user.save()

        instance.job_title = validated_data.get(
            "job_title", instance.job_title)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.photo = validated_data.get("photo", instance.photo)

        update_department_id(instance, validated_data)

        instance.save()
        return instance

    def validate_department(self, department_id):
        # Department_id is nullable. We only accept department ids that actually exist.
        if department_id == None:
            return
        try:
            Department.objects.get(id=department_id)
        except Exception as e:
            raise serializers.ValidationError(e)
        return department_id


class EmployeeIdsSerializer(serializers.Serializer):
    # This serializer is used for things like displaying owners and watchers
    class Meta:
        fields = ('employee_ids')
    employee_ids = serializers.ListField(
        child=serializers.IntegerField(), required=True)


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ("id", "customer", "employee", "total_due", "total_paid",
                  "date_added", "date_due", "incoming", "description", "pdf", "date_paid")

    def create(self, validated_data):
        # Need customer create function for setting the employee and updating the watchers
        invoice = Invoice.objects.create(total_due=validated_data.get("total_due"), total_paid=validated_data.get("total_paid"),
                                         date_due=validated_data.get("date_due"), incoming=validated_data.get("incoming"),
                                         description=validated_data.get("description"), pdf=validated_data.get("pdf"),
                                         customer=validated_data.get("customer"), date_paid=validated_data.get("date_paid"))
        invoice.employee = Employee.objects.get(
            id=self.context["request"].user.id)
        invoice.save()
        invoice.customer.update_watchers()
        return invoice

    def update(self, instance, validated_data):
        # No changing the customer on an invoice
        if "customer" in validated_data:
            del validated_data["customer"]
        super(InvoiceSerializer, self).update(instance, validated_data)
        instance.save()
        instance.customer.update_watchers()
        return instance


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ("id", "description", "first_name", "last_name", "job_title", "gender", "tag", "email", "phone", "photo",
                  "department", "department_name", "organisation", "organisation_name", "tag", "invoices", "can_edit",
                  "is_watcher", "owners", "watchers", "average_invoice", "total_invoice", "total_paid", "total_overdue")
    # We take in the dep/org id, and display the name
    department = serializers.IntegerField(
        write_only=True, allow_null=True, required=False)
    department_name = serializers.CharField(
        source="department.name", read_only=True, required=False)
    organisation = serializers.IntegerField(
        write_only=True, allow_null=True, required=False)
    organisation_name = serializers.CharField(
        source="organisation.name", read_only=True, required=False)

    # All these fields have their own function to calculate them below
    invoices = serializers.SerializerMethodField()
    average_invoice = serializers.SerializerMethodField()
    total_invoice = serializers.SerializerMethodField()
    total_paid = serializers.SerializerMethodField()
    total_overdue = serializers.SerializerMethodField()

    can_edit = serializers.SerializerMethodField()
    is_watcher = serializers.SerializerMethodField()
    owners = EmployeeIdsSerializer(
        source="get_owners", read_only=True, required=False)
    watchers = EmployeeIdsSerializer(
        source="get_watchers", read_only=True, required=False)

    def get_invoices(self, obj):
        invoices = Invoice.objects.filter(customer=obj)
        serializer = InvoiceSerializer(invoices, many=True)
        return serializer.data

    def get_average_invoice(self, obj):
        return obj.get_average_invoice()

    def get_total_invoice(self, obj):
        return obj.get_total_invoice()

    def get_total_paid(self, obj):
        return obj.get_total_paid()

    def get_total_overdue(self, obj):
        return obj.get_total_overdue()

    def get_can_edit(self, obj):
        return obj.is_editable(self.context["request"].user)

    def get_is_watcher(self, obj):
        return obj.is_watcher(self.context["request"].user.id)

    def create(self, validated_data):
        customer = Customer.objects.create(description=validated_data.get("description"), first_name=validated_data.get("first_name"), last_name=validated_data.get("last_name"),
                                           job_title=validated_data.get("job_title"), email=validated_data.get("email"),  phone=validated_data.get("phone"),
                                           photo=validated_data.get("photo"), tag=validated_data.get("tag"), gender=validated_data.get("gender"))
        update_department_id(customer, validated_data)
        update_organisation_id(customer, validated_data)
        customer.save()
        # The creator is an owner and a watcher automatically
        employee_id = self.context["request"].user.id
        if employee_id != None:
            employee = Employee.objects.get(id=employee_id)
            customer_owner = CustomerOwner.objects.create(
                customer=customer, employee=employee)
            customer_owner.save()
            customer_watcher = CustomerWatcher.objects.create(
                customer=customer, employee=employee)
            customer_watcher.save()
        return customer

    def update(self, instance, validated_data):
        update_department_id(instance, validated_data)
        update_organisation_id(instance, validated_data)
        instance.first_name = validated_data.get(
            "first_name", instance.first_name)
        instance.last_name = validated_data.get(
            "last_name", instance.last_name)
        instance.job_title = validated_data.get(
            "job_title", instance.job_title)
        instance.email = validated_data.get("email", instance.email)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.photo = validated_data.get("photo", instance.photo)
        instance.tag = validated_data.get("tag", instance.tag)
        instance.gender = validated_data.get("gender", instance.gender)
        instance.save()
        instance.update_watchers()
        return instance

    def validate_department(self, department_id):
        # Department_id is nullable
        if department_id == None:
            return
        try:
            Department.objects.get(id=department_id)
        except Exception as e:
            raise serializers.ValidationError(e)
        return department_id

    def validate_organisation(self, organisation_id):
        # Department_id is nullable
        if organisation_id == None:
            return
        try:
            Organisation.objects.get(id=organisation_id)
        except Exception as e:
            raise serializers.ValidationError(e)
        return organisation_id
