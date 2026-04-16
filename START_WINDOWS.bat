@echo off
REM Password Strength Analyzer - Windows Quick Start Script
REM This script sets up and runs the application on Windows

echo.
echo ========================================
echo Password Strength Analyzer - Quick Start
echo ========================================
echo.

REM Check Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/5] Creating virtual environment...
if not exist venv (
    python -m venv venv
    echo Virtual environment created!
) else (
    echo Virtual environment already exists, skipping...
)

echo.
echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/5] Installing dependencies...
cd backend
pip install -q -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [4/5] Starting Flask backend server...
echo Backend URL: http://localhost:5000
echo.
echo To open the frontend:
echo   - Navigate to: frontend\index.html
echo   - Or open in browser: file:///your-path/NM new/frontend/index.html
echo.
echo Press Ctrl+C to stop the server
echo.

cd backend
python app.py
