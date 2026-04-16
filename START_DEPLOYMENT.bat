@echo off
REM Password Strength Analyzer - Deployment Script for Windows

echo.
echo 🚀 Password Strength Analyzer - Deployment Setup
echo ==================================================
echo.

REM Check if running from correct directory
if not exist "package.json" (
    echo ❌ Error: package.json not found!
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo 1. Installing Backend Dependencies...
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed!
echo.

echo 2. Installing Frontend Dependencies...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm not found! Please install Node.js from nodejs.org
    pause
    exit /b 1
)
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed!
echo.

echo 3. Testing Backend API...
cd backend
timeout /t 1 /nobreak > nul
start "" python app.py
timeout /t 3 /nobreak > nul
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing } catch { exit 1 }"
if %errorlevel% equ 0 (
    echo ✅ Backend API is working!
    taskkill /f /im python.exe >nul 2>nul
) else (
    echo ❌ Backend API test failed
    taskkill /f /im python.exe >nul 2>nul
)
cd ..
echo.

echo 4. Building Frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✅ Frontend built successfully!
echo.

echo ✅ All preparations complete!
echo.
echo 📋 Next Steps:
echo.
echo 1. Push to GitHub:
echo    git add .
echo    git commit -m "Add deployment configurations"
echo    git push origin main
echo.
echo 2. Deploy to Render (Backend):
echo    - Go to render.com
echo    - Create Web Service from GitHub
echo    - Select this repository
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: gunicorn app:app --bind 0.0.0.0:10000
echo.
echo 3. Deploy to Vercel (Frontend):
echo    - Go to vercel.com
echo    - Import this GitHub repository
echo    - Output Directory: frontend
echo    - Set VITE_API_URL environment variable to your Render backend URL
echo.
echo 🎉 Setup complete! See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
