# Generated by Django 3.2.6 on 2021-09-18 10:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20210914_1907'),
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_due', models.DecimalField(decimal_places=12, max_digits=12)),
                ('total_paid', models.DecimalField(decimal_places=12, max_digits=12)),
                ('date_added', models.DateField(auto_now_add=True)),
                ('date_due', models.DateField(blank=True, null=True)),
                ('incoming', models.BooleanField()),
                ('description', models.CharField(max_length=255)),
                ('pdf', models.BinaryField(blank=True, null=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.customer')),
                ('employee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.employee')),
            ],
            options={
                'db_table': 'invoice',
            },
        ),
    ]