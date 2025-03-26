#!/usr/bin/env bash
set -o errexit

# Install Node.js using nvm
#curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
#export NVM_DIR="$HOME/.nvm"
##[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
#nvm install 20
#nvm use 20

# Build frontend
#cd ../frontend
#npm install
#npm run build

# Copy frontend files to Django
#mkdir -p ../backend/templates
#cp dist/index.html ../backend/templates/
#cp -r dist/assets ../backend/static/

# Return to backend directory
#cd ../backend

# Django setup
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate