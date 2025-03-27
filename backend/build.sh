#!/usr/bin/env bash
set -o errexit

# ... (keep existing nvm/node setup)

# Build frontend
cd ../frontend
npm install
npm run build

# Create required Django directories
mkdir -p ../backend/backend/static
mkdir -p ../backend/backend/templates

# Copy files to INNER backend folder
cp -r dist/assets/* ../backend/backend/static/
cp dist/index.html ../backend/backend/templates/

# Return to backend directory
cd ../backend

# Django setup
python -m pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed