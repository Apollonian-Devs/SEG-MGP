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
  - `models/`: Database models
  - `views/`: Handles the logic for requests
  - `serializers/`: Serializers for converting data
  - - `helpers/`: Helpers for maintaining communication between views and database
  - `urls.py`: URL routing for the app
- `backend/`: Backend configuration folder
  - `settings.py`: Configuration settings for the backend
  - `urls.py`: URL routing for the backend
  - `wsgi.py`: Web Server Gateway Interface configuration
  - `asgi.py`: Asynchronous Server Gateway Interface configuration
- `manage.py`: Command-line utility for

## Deployed version of the application

The deployed version of the application can be found at: **https://seg-mgp-65aa.onrender.com/**

## Installation instructions

Please see the separate Developer's Manual for full installation instructions.


## Sources

The packages used by backend are specified in `requirements.txt`, and can be installed with pip install -r requreiments.txt
The packages used by the frontend are specified in 'package.json', and can be installed with npm install
