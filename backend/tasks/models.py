from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    title=models.CharField(max_length=120)
    description=models.CharField(max_length=500)
    completed=models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    