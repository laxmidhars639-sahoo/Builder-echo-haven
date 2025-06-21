@echo off
echo 🛩️ Starting SkyTraining Application...
echo ======================================

REM Check if we're in the right directory
if not exist package.json (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist backend (
    echo ❌ Error: Backend directory not found
    pause
    exit /b 1
)

REM Start backend server
echo 🚀 Starting backend server...
cd backend

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing backend dependencies...
    call npm install
)

REM Start backend in background
echo 🔧 Starting backend server on port 5000...
start "SkyTraining Backend" cmd /c "npm run dev-simple"

REM Give backend time to start
timeout /t 3 /nobreak > nul

REM Go back to root directory
cd ..

REM Start frontend server
echo 🌐 Starting frontend server...

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing frontend dependencies...
    call npm install
)

REM Start frontend
echo 🎨 Starting frontend server...
start "SkyTraining Frontend" cmd /c "npm run dev"

echo.
echo ✅ Both servers started in separate windows!
echo ======================================
echo 🔗 Frontend: http://localhost:8080
echo 🔗 Backend:  http://localhost:5000
echo 🔗 API Health: http://localhost:5000/api/health
echo ======================================
echo Close the terminal windows to stop the servers
echo.
pause
