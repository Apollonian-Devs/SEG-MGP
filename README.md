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

1. Create venv (virtual environment folder)
2. Activate and download packages in requirements.txt
3. Migrate the database
4. Runserver

#### Linux/MacOS

```
$ virtualenv venv
$ source venv/bin/activate
$ pip3 install -r requirements.txt
$ python3 manage.py migrate
$ python3 manage.py runserver
```

#### Window

```
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Sources

The packages used by backend are specified in `requirements.txt`
