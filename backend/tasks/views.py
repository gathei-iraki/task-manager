from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Todo
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

# Create your views here.

class TaskView(viewsets.ModelViewSet):
    serializer_class=TaskSerializer
    queryset=Todo.objects.all()

# User Registration View
@require_http_methods(['GET', 'POST'])
def register(request):
    if request.method == 'POST':
        form = request.POST
        username = form['username']
        email = form['email']
        password = form['password']
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'A user with that email already exists.'}, status=400)
        else:
            if not username:
                username = email  # User.objects.create_user() must have a username
            user = User.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({'success': 'Registration successful, please log in'}, status=201)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# User Login View
@require_http_methods(['GET', 'POST'])
def login_view(request):
    if request.method == 'POST':
        form = request.POST
        email = form['email']
        password = form['password']
        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            login(request, user)
            return JsonResponse({'success': 'Login successful!'}, status=200)
        return JsonResponse({'error': 'Incorrect email address or password.'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# User Logout View
def logout_view(request):
    logout(request)
    return JsonResponse({'success': 'Logout successful'}, status=200)