#!/usr/bin/env bash
set -o errexit

# ... (keep existing nvm/node setup)

# Build frontend
cd ../frontend
npm install
npm run build

# Create required Django directories
mkdir -p ../backend/static/assets
mkdir -p ../backend/templates

# Copy built files
cp -r dist/assets/* ../backend/static/assets/
cp dist/index.html ../backend/templates/

# Return to backend directory
cd ../backend

# Django setup
python -m pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed