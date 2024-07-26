from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TaskSerializer, UserSerializer
from .models import Task  # Ensure this matches your model import
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

# DRF ViewSet for Task
class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

# User Registration View
@require_http_methods(['GET', 'POST'])
def register(request):
    if request.method == 'POST':
        form = request.POST
        username = form['username']
        password = form['password']
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'A user with that username already exists.'}, status=400)
        else:
            user = User.objects.create_user(username=username, password=password)
            return JsonResponse({'success': 'Registration successful, please log in'}, status=201)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# User Login View
@require_http_methods(['GET', 'POST'])
def login_view(request):
    if request.method == 'POST':
        form = request.POST
        username = form['username']
        password = form['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': 'Login successful!'}, status=200)
        return JsonResponse({'error': 'Incorrect username or password.'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# User Logout View
def logout_view(request):
    logout(request)
    return JsonResponse({'success': 'Logout successful'}, status=200)
