from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from tasks.models import Task

class TaskManagerTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.task = Task.objects.create(title='Test Task', description='Test Description', completed=False, user=self.user)

    def test_create_task(self):
        data = {'title': 'New Task', 'description': 'New Description', 'completed': False}
        response = self.client.post('/api/tasks/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], 'New Task')

    def test_list_tasks(self):
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Task')

    def test_retrieve_task(self):
        response = self.client.get(f'/api/tasks/{self.task.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Test Task')

    def test_update_task(self):
        data = {'title': 'Updated Task', 'description': 'Updated Description', 'completed': True}
        response = self.client.put(f'/api/tasks/{self.task.id}/', data, format='json')
        self.assertEqual(response.status_code, 200)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Updated Task')
        self.assertEqual(self.task.description, 'Updated Description')
        self.assertTrue(self.task.completed)

    def test_delete_task(self):
        response = self.client.delete(f'/api/tasks/{self.task.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Task.objects.filter(id=self.task.id).exists())

    def test_register_user(self):
        data = {'username': 'newuser', 'password': 'newpassword'}
        response = self.client.post('/register/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_login_user(self):
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post('/login/', data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)

    def test_logout_user(self):
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, 200)
