import datetime
from django.db import models
from django.conf import settings
from django.db.models.aggregates import Avg, Sum
from django.db.models.deletion import CASCADE
from django.core.validators import MinLengthValidator
from django.core.mail import send_mail
from django.core.validators import FileExtensionValidator
from os.path import splitext
from uuid import uuid4

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
    def imagename(self, filename):
        extension = splitext(filename)[1]
        return "customers" + "/" + uuid4().hex + extension
    photo = models.ImageField(upload_to=imagename, default= "default.png", null = True, blank = True)
    department = models.ForeignKey(Department, on_delete= models.SET_NULL, null = True)
    organisation = models.ForeignKey(Organisation, on_delete= models.SET_NULL, null = True)
    tag = models.CharField(max_length=255, null = True, blank = True)
    gender = models.CharField(max_length=1, validators=[MinLengthValidator(1)], null=True, blank=True)

    def is_watcher(self, employee_id):
        return CustomerWatcher.objects.filter(customer = self.id, employee = employee_id).exists()
    def is_owner(self, employee_id):
        return CustomerOwner.objects.filter(customer = self.id, employee = employee_id).exists()
    def is_editable(self, user):
        return user.is_superuser or self.is_owner(user.id)
    def get_watchers(self):
        customer_watchers = CustomerWatcher.objects.filter(customer = self.id)
        employee_ids = customer_watchers.values_list('employee', flat=True)
        return {"employee_ids": employee_ids}
    def get_owners(self):
        customer_owners = CustomerOwner.objects.filter(customer = self.id)
        employee_ids = customer_owners.values_list('employee', flat=True)
        return {"employee_ids": employee_ids}
    def update_watchers(self):
        customer = self
        customer_watchers = CustomerWatcher.objects.filter(customer = customer.id)
        for customer_watcher in customer_watchers:
            employee = customer_watcher.employee
            send_mail('Customer ' + str(customer.first_name) + ' ' + str(customer.last_name) + ' has been updated.', 'Visit https://dev.dv6hru9as863g.amplifyapp.com to see more.',
            None, [employee.id.email], fail_silently=False)
            
    def get_average_invoice(self):
        invoices = Invoice.objects.filter(customer=self)
        average = invoices.aggregate(avg=Avg('total_due'))["avg"]
        return None if average is None else round(average, 2)

    def get_average_invoice_or_zero(self):
        average = self.get_average_invoice()
        return 0 if average is None else average

    def get_total_invoice(self):
        invoices = Invoice.objects.filter(customer=self)
        total = invoices.aggregate(sum=Sum('total_due'))["sum"]
        return 0 if total is None else round(total, 2)

    def get_total_paid(self):
        invoices = Invoice.objects.filter(customer=self)
        total = invoices.aggregate(sum=Sum('total_paid'))["sum"]
        return 0 if total is None else round(total, 2)

    def get_total_overdue(self):
        invoices = Invoice.objects.filter(customer=self, date_paid = None, date_due__lt=datetime.date.today())
        total_paid = invoices.aggregate(sum = Sum('total_paid'))["sum"]
        total_due = invoices.aggregate(sum = Sum("total_due"))["sum"]
        return 0 if total_due is None or total_paid is None else round(total_due - total_paid, 2)

    class Meta:
        db_table = "customer"

# This class is in a one to one relationship with the auth_user table
class Employee(models.Model):
    id = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=CASCADE, db_column='id')
    job_title = models.CharField(max_length=255, null = True, blank = True)
    phone = models.CharField(max_length=255, null= True, blank = True)
    def imagename(self, filename):
        extension = splitext(filename)[1]
        return "employees" + "/" + uuid4().hex + extension
    photo = models.ImageField(upload_to=imagename, default= "default.png", null = True, blank = True)
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
    date_paid=models.DateField(null = True,blank=True)
    def pdfname(self, filename):
        extension = splitext(filename)[1]
        return "invoices" + "/" + uuid4().hex + extension
    pdf = models.FileField(upload_to=pdfname,validators=[FileExtensionValidator(['pdf'])], null = True, blank = True)

    class Meta:
        db_table = "invoice"
