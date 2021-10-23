from datetime import date, timedelta
from django.test import TestCase
from app.models import Customer, Department, Employee, Organisation
from app.serializers import CustomerSerializer, EmployeeSerializer, InvoiceSerializer
from rest_framework.test import APIRequestFactory

class CustomerTestClass(TestCase):
    def test(self):
        self.Test0_employee_creation()
        self.Test1_customer_creation()
        self.Test2_organisation_department_creation()
        self.Test3_invoice_creation()

    # Necessary for setting things like owner for customers upon creation
    def get_serializer_context(self):
        request = APIRequestFactory().post("/")
        request.user = self.get_employee().id
        return {"request": request}

    def get_employee(self):
        return Employee.objects.get(id__username = "employee")

    def get_customer(self):
        return Customer.objects.get(email = "jack@testington.com")

    def Test0_employee_creation(self):
        validated_data = {"username": "employee", "password": "employee", "first_name": "e", "last_name": "e", "email": "e@e.com"}
        employee_serializer = EmployeeSerializer(data=validated_data)
        employee_serializer.is_valid(raise_exception=True)
        employee_serializer.save()

    def Test1_customer_creation(self):
        validated_data = {}
        validated_data['first_name'] = "Jack"
        validated_data['last_name'] = "Testington"
        validated_data['email'] = "jack@testington.com"

        customer_serializer = CustomerSerializer(data=validated_data, context = self.get_serializer_context())
        customer_serializer.is_valid(raise_exception=True)
        customer_serializer.save()

        c = self.get_customer()
        self.assertEqual(c.first_name + " " + c.last_name, "Jack Testington")
        self.assertTrue(c.is_owner(self.get_employee()))

    def Test2_organisation_department_creation(self):
        department = Department.objects.create(name = "Ministry of Silly Walks")
        c = self.get_customer()
        c.department = department
        c.save()

        organisation = Organisation.objects.create(name = "Peaky Blinders")
        c.organisation = organisation
        c.save()

        serializer = CustomerSerializer(c, context = self.get_serializer_context())
        self.assertEqual(serializer.data["department_name"], "Ministry of Silly Walks")
        self.assertEqual(serializer.data["organisation_name"], "Peaky Blinders")
        
    def Test3_invoice_creation(self):
        # Year overdue invoice
        validated_data = {"customer": self.get_customer().id, "total_due": 20, "total_paid": "5", "description": "Catering Services",
            "date_due": date.today() - timedelta(days=90), "incoming": False}
        serializer = InvoiceSerializer(data = validated_data, context = self.get_serializer_context())
        serializer.is_valid(raise_exception = True)
        serializer.save()

        serializer = CustomerSerializer(self.get_customer(), context = self.get_serializer_context())
        self.assertEqual(serializer.data["total_overdue"], 15)

        
