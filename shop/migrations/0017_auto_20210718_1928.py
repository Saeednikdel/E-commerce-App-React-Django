# Generated by Django 3.1.3 on 2021-07-19 03:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0016_auto_20210718_1631'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='sold_no',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='item',
            name='stock_no',
            field=models.IntegerField(default=0),
        ),
    ]
