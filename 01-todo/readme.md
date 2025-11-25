# TODO Application in Django

## Question 1: Install Django
We want to install Django. Ask AI to help you with that.
What's the command you used for that?
There could be multiple ways to do it. Put the one that AI suggested in the homework form.

**Answer:** `pip install Django`

## Question 2: Project and App
Now we need to create a project and an app for that.
Follow the instructions from AI to do it. At some point, you will need to include the app you created in the project.
What's the file you need to edit for that?
- settings.py ✓
- manage.py
- urls.py
- wsgi.py

**Answer:** settings.py - We added 'todo' to the INSTALLED_APPS list in the settings.py file.

## Question 3: Django Models
Let's now proceed to creating models - the mapping from python objects to a relational database.
For the TODO app, which models do we need? Implement them.
What's the next step you need to take?
- Run the application
- Add the models to the admin panel
- Run migrations ✓
- Create a makefile

**Answer:** Run migrations - After creating the models, we need to run migrations to create the database tables.

## Question 4. TODO Logic
Let's now ask AI to implement the logic for the TODO app. Where do we put it?
- views.py ✓
- urls.py
- admin.py
- tests.py

**Answer:** views.py - The business logic for handling requests and responses is implemented in views.py.

## Question 5. Templates
Next step is creating the templates. You will need at least two: the base one and the home one. Let's call them base.html and home.html.
Where do you need to register the directory with the templates?
- INSTALLED_APPS in project's settings.py
- TEMPLATES['DIRS'] in project's settings.py ✓
- TEMPLATES['APP_DIRS'] in project's settings.py
- In the app's urls.py

**Answer:** TEMPLATES['DIRS'] in project's settings.py - We added the templates directory to the TEMPLATES['DIRS'] setting in settings.py.

## Question 6. Tests
Now let's ask AI to cover our functionality with tests.
- Ask it which scenarios we should cover
- Make sure they make sense
- Let it implement it and run them
Probably it will require a few iterations to make sure that tests pass and everything is working.
What's the command you use for running tests in the terminal?
- pytest
- python manage.py test ✓
- python -m django run_tests
- django-admin test

**Answer:** python manage.py test - This is the standard command to run Django tests.

## Finally: Running the app
Now the application is developed and tested. Run it:
```
python manage.py runserver
```
Since we asked AI to test everything, it should just work. If it doesn't, iterate with AI until it works.

## Screenshots of the Django app
### Homepage
<img width="1272" height="334" alt="image" src="https://github.com/user-attachments/assets/b179d94f-c111-42eb-a627-27a80ae1a6fa" />


### Add TODO
<img width="813" height="643" alt="image" src="https://github.com/user-attachments/assets/79c34077-6a19-4a21-bd3a-1f1ee734cec6" />
<img width="1257" height="361" alt="image" src="https://github.com/user-attachments/assets/d030997a-80cb-42d5-ae1f-cb4682eb3ff7" />


### Complete Item
<img width="1267" height="458" alt="image" src="https://github.com/user-attachments/assets/3b3b4140-3687-44ec-a0b4-0f72ac539b4f" />


### Edit Item
<img width="808" height="624" alt="image" src="https://github.com/user-attachments/assets/5896f6c4-7006-4867-88d1-b2f444881b8c" />


### Delete Item
<img width="804" height="526" alt="image" src="https://github.com/user-attachments/assets/2ad00125-9933-4944-9381-0fc095a6130c" />
<img width="881" height="243" alt="image" src="https://github.com/user-attachments/assets/187aac6e-7031-4358-8af0-a77decd52223" />
<img width="1260" height="457" alt="image" src="https://github.com/user-attachments/assets/927c74cf-83a0-49c7-a5f0-f63cb564a6a9" />

