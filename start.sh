#!/bin/bash

echo "Starting AI Interview Prep Application..."
echo

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo
echo "Installing Node.js dependencies..."
npm install

echo
echo "Starting backend server..."
python app.py &
BACKEND_PID=$!

echo
echo "Waiting for backend to start..."
sleep 3

echo
echo "Starting frontend server..."
npm start &
FRONTEND_PID=$!

echo
echo "Application is starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers..."

# Wait for user to stop the application
wait 