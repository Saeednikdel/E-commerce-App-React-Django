# Generated by Django 3.1.3 on 2021-07-28 19:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0024_remove_item_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='color',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='shop.color'),
        ),
    ]
