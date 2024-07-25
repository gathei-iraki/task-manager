
from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed', 'created_at', 'user')

admin.site.register(Task,TaskAdmin)
