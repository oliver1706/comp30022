from app.models import Customer, Employee
from rest_framework import serializers
from django.contrib.auth.models import User

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ("id", "job_title", "phone", "username", "first_name", "last_name", "email", "password", "photo")

    id = serializers.PrimaryKeyRelatedField(source="id.id", read_only = True)
    username = serializers.CharField(source="id.username")
    password = serializers.CharField(source="id.password", write_only = True, required = True)
    first_name = serializers.CharField(source="id.first_name")
    last_name = serializers.CharField(source="id.last_name")
    email = serializers.EmailField(source="id.email")

    
    def create(validated_data):
        user = User.objects.create_user(validated_data["username"], validated_data["email"], validated_data["password"])
        user.first_name = validated_data["first_name"]
        user.last_name = validated_data["last_name"]
        user.save()
        
        employee = Employee(id = user, job_title = validated_data.get("job_title"),
            phone = validated_data.get("phone"), photo = validated_data.get("photo"))
        employee.save()
        
        return user.id
