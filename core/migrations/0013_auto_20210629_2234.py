# Generated by Django 3.2.2 on 2021-06-29 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_audiodata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audiodata',
            name='input_audio',
            field=models.URLField(default='', max_length=500),
        ),
        migrations.AlterField(
            model_name='audiodata',
            name='output_audio',
            field=models.TextField(default='', max_length=1500),
        ),
    ]
