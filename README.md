# Team Apollonian Devs Group project

[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Framer Motion](https://img.shields.io/badge/framer--motion-%23fff?style=for-the-badge&logo=framer&logoColor=black)](https://www.framer.com/motion/) [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/) [![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)

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
```
3. Running the application
```
npm run dev
```
#### Running tests for frontend
Test:
```
npm run test
```
Coverage:
```
npm run coverage
```
### Backend 

Note: Although mostly the same at each step, the first set of commands at each step are for Linux and MacOS users while the second set of commands at each step are for Windows users.

First set up and activate a virtual environment in the root directory of the project.
Note: The first set of commands below are for Linux and MacOS users while the second set of commands are for Windows users.

⚠️ **Python Version Requirement** 
Please ensure you are using Python 3.12. We experienced issues when trying to use Python 3.13, specifically with an external AI library that we used not supporting this latest version, and therefore our application may not function properly if using Python 3.13. 
```
$ python3.12 -m venv venv
$ source venv/bin/activate
```
```
> py -3.12 -m venv venv
> venv/Scripts/activate
```
**Ensure you are in the backend directory for the following instructions.**
Note: If using Windows, remove the 3 from pip and python, such that all commands are either pip ... or python ...
Install all the required packages:
```
$ pip3 install -r requirements.txt
```
Migrate the database:
```
$ python3 manage.py migrate
```
Seed the database: 
```
$ python3 manage.py seed
```
Run the backend server:
```
$ python3 manage.py runserver
```

#### Running tests for backend
You can run all backend tests with the command:
```
$ python3 manage.py test
```
Obtain the coverage of the backend tests:
```
$ coverage run manage.py test
```
You can either get a basic report on the command line interface (using the first command) or as a more detailed html report (using the second command):
```
$ coverage report
$ coverage html
```


## Sources

The packages used by backend are specified in `requirements.txt`
