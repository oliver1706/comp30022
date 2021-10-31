
# BACKEND

### First time/infrastructure setup (per environment)
1. Setup a relational, publicly accessible database. For development purposes, we used AWS' free-tier RDS MariaDB offering. Once set-up, provide the details in the DATABASES section of settings.py (under backend/backend). You can then run `python manage.py migrate` and Django will fully setup all necessary database tables.
2. To enable photo and file upload functionality, you'll need to create a fully publicly accessible S3 bucket. Once the bucket has been made, you'll need to place a "default.png" in the top level of the bucket to be used for displaying customers and employees without photos. An example default.png is provided in the git. You'll then need to make an IAM user that is capable of accessing and uploading to the bucket (S3 full access) and then set the values AWS_STORAGE_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in settings.py.
3. For the updating of watchers functionality, you'll also need to fill out the EMAIL related variables in settings.py using an email host of your choice (we used Gmail for development purposes).
4. For all environments you will likely need at least an admin user for testing purposes. To make one, run
`python manage.py shell`
`import EmployeeSerializer from app.serializers`
`EmployeeSerializer.create_superuser({"username": "admin", "first_name":"admin", "last_name":"admin", "password": "password", "job_title": "admin", "email":" "admin@admin.com"})`
These values of course should be substituted (especially password) as desired.
Only the admin can create new users. This functionality means an admin user must be manually created in every environment, and then all users created using that admin's credentials.
The application should now be ready for local set-up. For deployment, refer to the below section.

### Local setup

1. Run `pip install -r requirements.txt` in the backend folder.
2. Run `python manage.py test` to run tests.
3. Run `python manage.py runserver` to bring up the server locally. It'll be running on http://localhost:8000/app/.
4. If you want to run requests, you can visit http://localhost:8000/app/api/schema/swagger-ui/ and click try it out, or simply view them.
5. Most of these requests will fail however, as you won't be logged in. For simple testing, you'll want to log in as the admin created in the first-time setup steps, using the /app/accounts/login/ endpoint (either in postman or another tool of your choice). This will return a json with a key, which can be used in the Authorization header like "Token abcd1234" (this spacing/format is important).
6. Import postman.postman_collection.json in postman. You will likely have to create a new environment with baseUrl set to localhost:8000. After this, you can click and run requests using the admin token, creating new resources like employees, customers, invoices and departments and modifying, and deleting them.

### Deployment
Django is just a simple WSGI application, and provides [instructions for deployment.](https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/) We did a simple manual ec2 deployment, though other methods are certainly possible. Before deploying however, make sure you have performed all the first-time setup steps for this environment.
Ensure in settings.py that DEBUG is false, and that SECRET_KEY is set to a secret value for the environment (of course, all credentials should be similarly protected and not committed to source control). [This key](https://docs.djangoproject.com/en/3.2/ref/settings/#std:setting-SECRET_KEY) is used for generating sessions tokens.
You'll also need to ensure that the paths in wsgi.py point to the backend folder (from the git). By default, they assume the backend folder is located in ~/comp30022/backend (under the home folder).
