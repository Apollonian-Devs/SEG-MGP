# Generated by Django 5.1.5 on 2025-02-01 16:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ticket',
            old_name='subject',
            new_name='title',
        ),
    ]
