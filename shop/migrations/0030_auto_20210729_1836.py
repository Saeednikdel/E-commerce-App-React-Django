# Generated by Django 3.1.3 on 2021-07-30 02:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0029_auto_20210729_1832'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='image_list',
        ),
        migrations.DeleteModel(
            name='Images',
        ),
    ]
