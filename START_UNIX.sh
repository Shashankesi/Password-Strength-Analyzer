#!/bin/bash

# Password Strength Analyzer - Unix/Linux Quick Start Script
# This script sets up and runs the application on macOS/Linux

echo ""
echo "========================================"
echo "Password Strength Analyzer - Quick Start"
echo "========================================"
echo ""

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ using:"
    echo "  - macOS: brew install python3"
    echo "  - Ubuntu/Debian: sudo apt-get install python3"
    echo "  - Fedora: sudo dnf install python3"
    exit 1
fi

echo "[1/5] Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created!"
else
    echo "✓ Virtual environment already exists, skipping..."
fi

echo ""
echo "[2/5] Activating virtual environment..."
source venv/bin/activate

echo ""
echo "[3/5] Installing dependencies..."
cd backend || exit 1
pip install -q -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
cd .. || exit 1

echo ""
echo "[4/5] Starting Flask backend server..."
echo "Backend URL: http://localhost:5000"
echo ""
echo "To open the frontend:"
echo "  - Open in your browser: file://$(pwd)/frontend/index.html"
echo "  - Or serve with Python: python3 -m http.server 8000 (from frontend dir)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================"
echo ""

cd backend || exit 1
python3 app.py
