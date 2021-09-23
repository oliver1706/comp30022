from django.db import models
from django.conf import settings
from django.db.models.deletion import CASCADE
from django.utils.translation import gettext_lazy as _ 

class Department(models.Model):
    name = models.CharField(max_length=255, null = False, blank = False, unique= True)
    class Meta:
        db_table = "department"

# Organisation a customer represents/is affiliated with
class Organisation(models.Model):
    name = models.CharField(max_length=255, null = False, blank = False, unique= True)
    class Meta:
        db_table = "organisation"

class Customer(models.Model):
    # Id autoincrement is automatically added apparently
    description = models.CharField(max_length=255, null= True, blank = True)
    first_name = models.CharField(max_length=255, null= True, blank = True)
    last_name = models.CharField(max_length=255, null= True, blank = True)
    job_title = models.CharField(max_length=255, null= True, blank = True)
    email = models.EmailField(max_length=255, null= True, blank = True)
    phone = models.CharField(max_length=255, null= True, blank = True)
    photo = models.ImageField(_("Image"),upload_to="customers", default= "default.png")
    department = models.ForeignKey(Department, on_delete= models.SET_NULL, null = True)
    organisation = models.ForeignKey(Organisation, on_delete= models.SET_NULL, null = True)
    class Meta:
        db_table = "customer"

# This class is in a one to one relationship with the auth_user table
class Employee(models.Model):
    id = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=CASCADE, db_column='id')
    job_title = models.CharField(max_length=255, null = True, blank = True)
    phone = models.CharField(max_length=255, null= True, blank = True)
    photo = models.ImageField(_("Image"),upload_to="employees", default= "default.png")
    department = models.ForeignKey(Department, on_delete= models.SET_NULL, null = True)
    class Meta:
        db_table = "employee"

class Invoice(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    total_due = models.DecimalField(max_digits=12, decimal_places=2, null=False)
    total_paid = models.DecimalField(max_digits=12, decimal_places=2, null=False)
    date_added = models.DateField(null = False, auto_now_add=True)
    date_due = models.DateField(null = True, blank = True)
    incoming = models.BooleanField(null = False)
    description = models.CharField(max_length=255, null = False)
    pdf = models.BinaryField(null = True, blank = True)

    class Meta:
        db_table = "invoice"
