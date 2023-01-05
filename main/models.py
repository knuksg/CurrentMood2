from django.db import models

# Create your models here.
class Location(models.Model):
    name = models.CharField(max_length=100)

class Song(models.Model):
    vidid = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    channel = models.CharField(max_length=200)
    img = models.CharField(max_length=200)

class Article(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
