from django.db import models
from django.conf import settings
from django.db.models.deletion import CASCADE
from django.utils.translation import gettext_lazy as _ 
from django.core.validators import MinLengthValidator
from django.core.mail import send_mail

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
    photo = models.ImageField(_("Image") ,upload_to="customers", default= "default.png", null = True, blank = True)
    department = models.ForeignKey(Department, on_delete= models.SET_NULL, null = True)
    organisation = models.ForeignKey(Organisation, on_delete= models.SET_NULL, null = True)
    tag = models.CharField(max_length=255, null = True, blank = True)
    gender = models.CharField(max_length=1, validators=[MinLengthValidator(1)], null=True, blank=True)

    def is_watcher(self, employee_id):
        return CustomerWatcher.objects.filter(customer = self.id, employee = employee_id).exists()
    def is_owner(self, employee_id):
        return CustomerOwner.objects.filter(customer = self.id, employee = employee_id).exists()
    def update_watchers(self):
        customer = self
        customer_watchers = CustomerWatcher.objects.filter(customer = customer.id)
        for customer_watcher in customer_watchers:
            employee = customer_watcher.employee
            send_mail('Customer ' + customer.first_name + ' ' + customer.last_name + ' has been updated!', 'Visit http://localhost:8000/app/customers/' + str(customer.id) + '/',
            None, [employee.id.email], fail_silently=False)
    class Meta:
        db_table = "customer"

# This class is in a one to one relationship with the auth_user table
class Employee(models.Model):
    id = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=CASCADE, db_column='id')
    job_title = models.CharField(max_length=255, null = True, blank = True)
    phone = models.CharField(max_length=255, null= True, blank = True)
    photo = models.ImageField(_("Image"),upload_to="employees", default= "default.png", null = True, blank = True)
    department = models.ForeignKey(Department, on_delete= models.SET_NULL, null = True)
    class Meta:
        db_table = "employee"

class CustomerWatcher(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    class Meta:
        db_table = "customer_watcher"
        unique_together = ["customer", "employee"]

class CustomerOwner(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    class Meta:
        db_table = "customer_owner"
        unique_together = ["customer", "employee"]

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
