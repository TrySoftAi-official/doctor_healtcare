#!/bin/bash

# Healthcare System Development Startup Script

echo "🚀 Starting Healthcare System Development Environment..."

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

# Start backend in background
echo "📦 Starting backend server..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Development environment started!"
echo "📊 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:5173"
echo "📚 API Docs: http://localhost:3000/api/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup on exit
echo "🛑 Stopping servers..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
echo "✅ Servers stopped"
