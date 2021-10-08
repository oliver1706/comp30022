# Generated by Django 3.2.6 on 2021-09-26 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_auto_20210924_0519'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='photo',
            field=models.ImageField(blank=True, default='default.png', null=True, upload_to='customers', verbose_name='Image'),
        ),
        migrations.AlterField(
            model_name='employee',
            name='photo',
            field=models.ImageField(blank=True, default='default.png', null=True, upload_to='employees', verbose_name='Image'),
        ),
    ]