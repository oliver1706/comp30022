from typing import OrderedDict
from django.test import TestCase
from app.models import Customer
from app.serializers import CustomerSerializer

class CustomerTestClass(TestCase):
    def test_success_creation(self):
        validated_data = OrderedDict()
        validated_data['first_name'] = "Jack"
        validated_data['last_name'] = "Testington"
        validated_data['email'] = "jack@testington.com"
        customer_serializer = CustomerSerializer()
        customer_serializer.create(validated_data)
        c = Customer.objects.get(email = "jack@testington.com")
        self.assertEqual(c.first_name + " " + c.last_name, "Jack Testington")
