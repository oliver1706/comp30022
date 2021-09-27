# Generated by Django 3.2.6 on 2021-09-27 09:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_auto_20210927_1857'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='gender',
            field=models.CharField(blank=True, max_length=1, null=True, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
        migrations.AddField(
            model_name='customer',
            name='tag',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
