from django.db import models

# Create your models here.

class Customer(models.Model):
    # Id autoincrement is automatically added apparently
    description = models.CharField(max_length=255, null= True, blank = True)
    first_name = models.CharField(max_length=255, null= True, blank = True)
    last_name = models.CharField(max_length=255, null= True, blank = True)
    job_title = models.CharField(max_length=255, null= True, blank = True)
    email = models.CharField(max_length=255, null= True, blank = True)
    phone = models.CharField(max_length=255, null= True, blank = True)
    photo = models.BinaryField(null= True, blank = True)
    class Meta:
        db_table = "customer"
