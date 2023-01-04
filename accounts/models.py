from django.db import models
from django.contrib.auth.models import AbstractUser
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=10, unique=True)
    location = models.CharField(max_length=100, blank=True)
    img = ProcessedImageField(
        upload_to = "profile_img/",
        blank = True,
        processors=[ResizeToFill(400, 400)],
        format='JPEG',
        options={'quality': 100},
    )