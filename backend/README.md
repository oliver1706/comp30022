# BACKEND

### Setup
1. Run `pip install -r requirements.txt` in the backend folder.
2. Run `python manage.py runserver` to bring up the server locally. It'll be running on http://localhost:8000/app/. For example, you can visit http://localhost:8000/app/employees/ to see all the employees.
3. If you want to run requests, you can visit http://localhost:8000/app/api/schema/swagger-ui/ and click try it out, or simply view them.
4. Import postman.postman_collection.json in postman. You will likely have to create a new environment with baseUrl set to localhost:8000. After this, you can click and run requests, creating new resources, modifying, and deleting them.
