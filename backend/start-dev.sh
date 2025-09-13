#!/bin/bash

# Development server startup script
echo "Starting HTN25 Backend Development Server..."

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
echo "Installing dependencies..."
pip install -r requirements.txt

# Start the development server
echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
