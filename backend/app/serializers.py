from app.models import Customer, Employee
from rest_framework import serializers

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    def get_username(self, obj):
        return obj.id.username

    first_name = serializers.SerializerMethodField()
    def get_first_name(self, obj):
        return obj.id.first_name

    last_name = serializers.SerializerMethodField()
    def get_last_name(self, obj):
        return obj.id.last_name

    email = serializers.SerializerMethodField()
    def get_email(self, obj):
        return obj.id.email

    class Meta:
        model = Employee
        fields = '__all__'
