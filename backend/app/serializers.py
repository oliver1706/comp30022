from app.models import Customer, CustomerOwner, CustomerWatcher, Department, Employee, Invoice, Organisation
from rest_framework import serializers
from django.contrib.auth.models import User
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
        fields = ("id", "job_title", "phone", "username", "first_name", "last_name", "email", "password", "photo", "department", "department_name")

    id = serializers.PrimaryKeyRelatedField(source="id.id", read_only = True)
    username = serializers.CharField(source="id.username")
    password = serializers.CharField(source="id.password", write_only = True, required = True)
    first_name = serializers.CharField(source="id.first_name")
    last_name = serializers.CharField(source="id.last_name")
    email = serializers.EmailField(source="id.email")
    department = serializers.IntegerField(write_only = True, allow_null = True, required = False)
    department_name = serializers.CharField(source = "department.name", read_only = True, required = False)
    
    def create(self, validated_data):
        user = User.objects.create_user(validated_data.get("id").get("username"), validated_data.get("id").get("email"), validated_data.get("id").get("password"))
        user.first_name = validated_data.get("id").get("first_name")
        user.last_name = validated_data.get("id").get("last_name")
        user.save()
        
        employee = Employee.objects.create(id = user, job_title = validated_data.get("job_title"),
            phone = validated_data.get("phone"), photo = validated_data.get("photo"))
        update_department_id(employee, validated_data)
        employee.save()
        
        return employee

    def update(self, instance, validated_data):
        user = instance.id
        user.first_name = validated_data.get("id", user.first_name).get("first_name", user.first_name)
        user.last_name = validated_data.get("id", user.last_name).get("last_name", user.last_name)
        user.email = validated_data.get("id", user.email).get("email", user.email)

        instance.job_title = validated_data.get("job_title", instance.job_title)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.photo = validated_data.get("photo", instance.photo)

        update_department_id(instance, validated_data)

        instance.save()
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

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ("customer", "employee", "total_due", "total_paid", "date_added", "date_due", "incoming", "description", "pdf")
        extra_kwargs = {"customer": {"write_only": True}}
        
    def create(self, validated_data):
        invoice = Invoice.objects.create(total_due = validated_data.get("total_due"), total_paid = validated_data.get("total_paid"), date_added = validated_data.get("date_added"),
            date_due = validated_data.get("date_due"), incoming = validated_data.get("incoming"), description = validated_data.get("description"), 
            pdf = validated_data.get("pdf"), customer = validated_data.get("customer"))
        invoice.employee = Employee.objects.get(id = self.context["request"].user.id)
        invoice.save()
        return invoice


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields =  ("id", "description", "first_name", "last_name", "job_title", "email", "phone", "photo", "department", "department_name",
        "organisation", "organisation_name", "invoices")
    department = serializers.IntegerField(write_only = True, allow_null = True, required = False)
    department_name = serializers.CharField(source = "department.name", read_only = True, required = False)
    organisation = serializers.IntegerField(write_only = True, allow_null = True, required = False)
    organisation_name = serializers.CharField(source = "organisation.name", read_only = True, required = False)
    invoices = serializers.SerializerMethodField()

    def get_invoices(self, obj):
        invoices = Invoice.objects.filter(customer=obj)
        serializer = InvoiceSerializer(invoices, many=True)
        return serializer.data


    def create(self, validated_data):
        customer = Customer.objects.create(description = validated_data.get("description"), first_name = validated_data.get("first_name"),
            last_name = validated_data.get("last_name"), job_title = validated_data.get("job_title"), email = validated_data.get("email"),
            phone = validated_data.get("phone"), photo = validated_data.get("photo"))
        update_department_id(customer, validated_data)
        update_organisation_id(customer, validated_data)
        customer.save()
        employee_id = self.context["request"].user.id
        if employee_id != None:
            employee = Employee.objects.get(id = employee_id)
            customer_owner = CustomerOwner.objects.create(customer = customer, employee = employee)
            customer_owner.save()
            customer_watcher = CustomerWatcher.objects.create(customer = customer, employee = employee)
            customer_watcher.save()
        return customer

    def update(self, instance, validated_data):
        update_department_id(instance, validated_data)
        update_organisation_id(instance, validated_data)
        instance.first_name = validated_data.get("first_name", instance.phone)
        instance.last_name = validated_data.get("last_name", instance.photo)
        instance.job_title = validated_data.get("job_title", instance.job_title)
        instance.email = validated_data.get("email", instance.phone)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.photo = validated_data.get("photo", instance.photo)
        instance.save()
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
