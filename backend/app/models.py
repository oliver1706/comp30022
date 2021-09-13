from django.db import models
from django.conf import settings
from django.db.models.deletion import CASCADE

class Department(models.Model):
    name = models.CharField(max_length=255, null = False, blank = False, unique= True)
    class Meta:
        db_table = "department"

class Customer(models.Model):
    # Id autoincrement is automatically added apparently
    description = models.CharField(max_length=255, null= True, blank = True)
    first_name = models.CharField(max_length=255, null= True, blank = True)
    last_name = models.CharField(max_length=255, null= True, blank = True)
    job_title = models.CharField(max_length=255, null= True, blank = True)
    email = models.CharField(max_length=255, null= True, blank = True)
    phone = models.CharField(max_length=255, null= True, blank = True)
    photo = models.BinaryField(null= True, blank = True)
    department = models.ForeignKey(Department, on_delete= models.SET_NULL, null = True)
    class Meta:
        db_table = "customer"

# This class is in a one to one relationship with the auth_user table
class Employee(models.Model):
    id = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=CASCADE, db_column='id')
    job_title = models.CharField(max_length=255, null = True, blank = True)
    phone = models.CharField(max_length=255, null= True, blank = True)
    photo = models.BinaryField(null= True, blank = True)
    department = models.ForeignKey(Department, on_delete= models.SET_NULL, null = True)
    class Meta:
        db_table = "employee"
