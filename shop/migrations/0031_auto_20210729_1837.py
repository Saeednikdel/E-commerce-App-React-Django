# Generated by Django 3.1.3 on 2021-07-30 02:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0030_auto_20210729_1836'),
    ]

    operations = [
        migrations.CreateModel(
            name='Images',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
            ],
        ),
        migrations.AddField(
            model_name='item',
            name='image_list',
            field=models.ManyToManyField(blank=True, null=True, to='shop.Images'),
        ),
    ]
