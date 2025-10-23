@echo off
echo 🚀 Starting Healthcare System Development Environment...

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Backend directory not found!
    exit /b 1
)

REM Start backend in background
echo 📦 Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run start:dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🌐 Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo ✅ Development environment started!
echo 📊 Backend: http://localhost:3000
echo 🌐 Frontend: http://localhost:5173
echo 📚 API Docs: http://localhost:3000/api/docs
echo.
echo Press any key to stop both servers
pause >nul

echo 🛑 Stopping servers...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Servers stopped
