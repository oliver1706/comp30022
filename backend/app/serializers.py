from django.shortcuts import get_object_or_404
from app.models import Customer, Department, Employee
from rest_framework import serializers
from django.contrib.auth.models import User

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
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
    department = serializers.IntegerField(write_only = True, allow_null = True)
    department_name = serializers.CharField(source = "department.name", required = False)

    
    def create(validated_data):
        user = User.objects.create_user(validated_data["username"], validated_data["email"], validated_data["password"])
        user.first_name = validated_data["first_name"]
        user.last_name = validated_data["last_name"]
        user.save()
        
        employee = Employee(id = user, job_title = validated_data.get("job_title"),
            phone = validated_data.get("phone"), photo = validated_data.get("photo"))
        employee.save()
        
        return user.id

    def update(self, instance, validated_data):
        user = instance.id
        user.first_name = validated_data.get("id", user.first_name).get("first_name", user.first_name)
        user.last_name = validated_data.get("id", user.last_name).get("last_name", user.last_name)
        user.email = validated_data.get("id", user.email).get("email", user.email)

        instance.job_title = validated_data.get("job_title", instance.job_title)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.photo = validated_data.get("photo", instance.photo)

        department_id = validated_data.get("department")
        if department_id != None:
            department = get_object_or_404(Department, id = department_id)
            instance.department = department
        else:
            instance.department = None

        instance.save()
        return instance
