from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes  # Importing here
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import Task
from .serializers import TaskSerializer
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
logger = logging.getLogger(__name__)

class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@csrf_exempt
@require_http_methods(['POST'])
def register(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        logger.info(f"Received data: {data}")

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            logger.error('Username and password are required.')
            return JsonResponse({'error': 'Username and password are required.'}, status=400)

        if User.objects.filter(username=username).exists():
            logger.error('A user with that username already exists.')
            return JsonResponse({'error': 'A user with that username already exists.'}, status=400)

        user = User.objects.create_user(username=username, password=password)
        logger.info(f"User created: {user}")
        return JsonResponse({'success': 'Registration successful, please log in'}, status=201)

    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        logger.error(f"Exception occurred: {e}")
        return JsonResponse({'error': 'An error occurred during registration.', 'details': str(e)}, status=500)

@csrf_exempt
@require_http_methods(['POST'])
def login_view(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'success': 'Login successful!', 'token': token.key}, status=200)
        return JsonResponse({'error': 'Incorrect username or password.'}, status=400)
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        logger.error(f"Exception occurred: {e}")
        return JsonResponse({'error': 'An error occurred during login.', 'details': str(e)}, status=500)
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    logout(request)
    return JsonResponse({'success': 'Logout successful'}, status=200)