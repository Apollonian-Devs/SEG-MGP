# Team Dionysus Games Group project

## Team members

The members of the team are:

- Josiah Chan
- Rahat Chowdhury
- Lucas Jaroenpanichying
- Dimitrios Katsoulis
- Siddhant Mohapatra
- Fahim Nouri Nasir
- Yau Ting Hiu Ryan
- Adam Wood

## Project Structure

The project consists of two main parts: the frontend and the backend.

### Frontend

The frontend is built with [ReactJS](https://reactjs.org/). It includes the following directories and files:

- `src/`: Contains all the source code for the React application
  - `components/`: Reusable components that make up the UI
  - `pages/`: Different page components for routing
  - `App.js`: Main application component
  - `index.js`: Entry point of the React application

### Backend

The backend is built with [Django](https://www.djangoproject.com/). It includes the following directories and files:

- `api/`: API application folder
  - `migrations/`: Database migration files
  - `models.py`: Database models
  - `views.py`: Handles the logic for requests
  - `serializers.py`: Serializers for converting data
  - `urls.py`: URL routing for the app
- `backend/`: Backend configuration folder
  - `settings.py`: Configuration settings for the backend
  - `urls.py`: URL routing for the backend
  - `wsgi.py`: Web Server Gateway Interface configuration
  - `asgi.py`: Asynchronous Server Gateway Interface configuration
- `manage.py`: Command-line utility for

## Deployed version of the application

The deployed version of the application can be found at: **\_**

## Installation instructions

### Frontend

1. Make sure you have nodeJS installed. (When you download nodeJS from the official website it normally comes with npm)
2. After cloning the repository, run the following command to install dependencies:

```
npm install
npm run dev
```


### Backend 

Note: Although mostly the same at each step, the first set of commands at each step are for Linux and MacOS users while the second set of commands at each step are for Windows users.

First set up and activate a virtual environment in the root directory of the project:
```
$ virtualenv venv
$ source venv/bin/activate
```
```
> python -m venv venv
> venv/Scripts/activate
```
Ensure you are in the backend directory for the following instructions.
Install all the required packages:
```
$ pip3 install -r requirements.txt
```
```
> pip install -r requirements.txt
```
Migrate the database:
```
$ python3 manage.py migrate
```
```
> python manage.py migrate
```
Seed the database: 
```
$ python3 manage.py seed
```
```
> python manage.py seed
```
Run the backend server:
```
$ python3 manage.py runserver
```
```
> python manage.py runserver
```

## Running tests for backend
You can run all backend tests with the command:
```
$ python3 manage.py test
```
```
> python manage.py test
```
Obtain the coverage of the backend tests:
```
$ coverage run manage.py test
```
```
> coverage run manage.py test
```
You can either get a report on the command line interface (using the first command) or as a more detailed html report (using the second command):
```
$ coverage report
$ coverage html
```
```
> coverage report
> coverage html
```


## Sources

The packages used by backend are specified in `requirements.txt`
