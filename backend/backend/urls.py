from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks import views

router = DefaultRouter()
router.register(r'tasks', views.TaskView, basename='task')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('', views.login_view, name='root'),  # Redirect root URL to the login view
    path('api/', include(router.urls)),  # Include DRF routes
]
