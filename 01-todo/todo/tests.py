from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from .models import Todo
from .forms import TodoForm

class TodoModelTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            description="Test description",
            due_date=timezone.now()
        )

    def test_todo_creation(self):
        """Test if a Todo object is created correctly"""
        self.assertEqual(self.todo.title, "Test Todo")
        self.assertEqual(self.todo.description, "Test description")
        self.assertFalse(self.todo.completed)

    def test_todo_string_representation(self):
        """Test the string representation of the Todo model"""
        self.assertEqual(str(self.todo), "Test Todo")

    def test_todo_default_completed_false(self):
        """Test that completed is False by default"""
        self.assertFalse(self.todo.completed)


class TodoViewTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_todo_list_view(self):
        """Test the todo list view"""
        response = self.client.get(reverse('todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "TODO Application")
        self.assertTemplateUsed(response, 'todo/todo_list.html')

    def test_todo_create_view_get(self):
        """Test the todo create view with GET request"""
        response = self.client.get(reverse('todo_create'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todo/todo_form.html')
        self.assertIsInstance(response.context['form'], TodoForm)

    def test_todo_create_view_post(self):
        """Test the todo create view with POST request"""
        data = {
            'title': 'New Todo',
            'description': 'New description',
            'due_date': '2025-12-31 10:00:00',
            'completed': False
        }
        response = self.client.post(reverse('todo_create'), data)
        self.assertRedirects(response, reverse('todo_list'))
        self.assertEqual(Todo.objects.count(), 1)
        self.assertEqual(Todo.objects.first().title, 'New Todo')

    def test_todo_update_view(self):
        """Test the todo update view"""
        todo = Todo.objects.create(title="Old Title", description="Old description")
        data = {
            'title': 'Updated Title',
            'description': 'Updated description',
            'due_date': '2025-12-31 10:00:00',
            'completed': True
        }
        response = self.client.post(reverse('todo_update', args=[todo.pk]), data)
        self.assertRedirects(response, reverse('todo_list'))
        todo.refresh_from_db()
        self.assertEqual(todo.title, 'Updated Title')
        self.assertTrue(todo.completed)

    def test_todo_delete_view(self):
        """Test the todo delete view"""
        todo = Todo.objects.create(title="Delete me", description="To be deleted")
        response = self.client.post(reverse('todo_delete', args=[todo.pk]))
        self.assertRedirects(response, reverse('todo_list'))
        self.assertEqual(Todo.objects.count(), 0)

    def test_todo_toggle_completed_view(self):
        """Test the todo toggle completed view"""
        todo = Todo.objects.create(title="Toggle Todo", description="Toggle description")
        self.assertFalse(todo.completed)
        
        response = self.client.get(reverse('todo_toggle_completed', args=[todo.pk]))
        self.assertRedirects(response, reverse('todo_list'))
        
        todo.refresh_from_db()
        self.assertTrue(todo.completed)
        
        # Test toggling back to not completed
        response = self.client.get(reverse('todo_toggle_completed', args=[todo.pk]))
        self.assertRedirects(response, reverse('todo_list'))
        
        todo.refresh_from_db()
        self.assertFalse(todo.completed)


class TodoFormTest(TestCase):
    def test_valid_form(self):
        """Test form with valid data"""
        form_data = {
            'title': 'Test Todo',
            'description': 'Test description',
            'due_date': timezone.now(),
            'completed': False
        }
        form = TodoForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_missing_title(self):
        """Test form with missing title (should be invalid)"""
        form_data = {
            'description': 'Test description',
            'due_date': timezone.now(),
            'completed': False
        }
        form = TodoForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('title', form.errors)
