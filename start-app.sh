#!/bin/bash

# SkyTraining Application Startup Script

echo "🛩️ Starting SkyTraining Application..."
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Start backend server
echo "🚀 Starting backend server..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start backend in background
echo "🔧 Starting backend server on port 5000..."
npm run dev-simple &
BACKEND_PID=$!

# Give backend time to start
sleep 3

# Go back to root directory
cd ..

# Start frontend server
echo "🌐 Starting frontend server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers started!"
echo "======================================"
echo "🔗 Frontend: http://localhost:8080"
echo "🔗 Backend:  http://localhost:5000"
echo "🔗 API Health: http://localhost:5000/api/health"
echo "======================================"
echo "Press Ctrl+C to stop both servers"

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "👋 Goodbye!"
    exit 0
}

# Set trap to handle Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
