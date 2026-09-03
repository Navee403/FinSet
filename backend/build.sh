#!/bin/bash
echo "Installing requirements..."
pip install -r requirements.txt

echo "Running database migrations..."
python manage.py migrate

echo "Build process completed!"
