# Generated by Django 3.2.16 on 2023-01-05 07:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vidid', models.CharField(max_length=200)),
                ('title', models.CharField(max_length=200)),
                ('channel', models.CharField(max_length=200)),
                ('img', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.location')),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.song')),
            ],
        ),
    ]
