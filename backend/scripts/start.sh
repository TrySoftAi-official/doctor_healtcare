#!/bin/bash

# Healthcare Management System Backend Startup Script

echo "🏥 Starting Healthcare Management System Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    cp env.example .env
    echo "📝 Please update .env file with your configuration before running again."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Start the application
echo "🚀 Starting NestJS application..."
npm run start:dev
