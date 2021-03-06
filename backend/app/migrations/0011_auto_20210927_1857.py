# Generated by Django 3.2.6 on 2021-09-27 08:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_customerowner_customerwatcher'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='customerowner',
            unique_together={('customer', 'employee')},
        ),
        migrations.AlterUniqueTogether(
            name='customerwatcher',
            unique_together={('customer', 'employee')},
        ),
        migrations.AlterModelTable(
            name='customerowner',
            table='customer_owner',
        ),
        migrations.AlterModelTable(
            name='customerwatcher',
            table='customer_watcher',
        ),
    ]
