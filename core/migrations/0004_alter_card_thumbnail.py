# Generated by Django 3.2.2 on 2021-05-21 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_card_thumbnail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='thumbnail',
            field=models.ImageField(upload_to=''),
        ),
    ]
