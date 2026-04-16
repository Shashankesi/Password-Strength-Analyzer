#!/bin/bash

# Password Strength Analyzer - Deployment Script for Unix/Linux/macOS

echo "🚀 Password Strength Analyzer - Deployment Setup"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${BLUE}1. Installing Backend Dependencies...${NC}"
cd backend
pip install --upgrade pip
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed!${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

echo -e "${BLUE}2. Installing Frontend Dependencies...${NC}"
if command -v npm &> /dev/null; then
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend dependencies installed!${NC}"
    else
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ npm not found! Please install Node.js${NC}"
    exit 1
fi

echo -e "${BLUE}3. Testing Backend Locally...${NC}"
cd backend
timeout 5 python app.py &
sleep 2
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend API is working!${NC}"
    pkill -f "python app.py"
else
    echo -e "${RED}❌ Backend API test failed${NC}"
    pkill -f "python app.py"
fi
cd ..

echo -e "${BLUE}4. Building Frontend...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend built successfully!${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All preparations complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add deployment configurations'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Render (Backend):"
echo "   - Go to render.com"
echo "   - Create Web Service from GitHub"
echo "   - Select this repository"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: gunicorn app:app --bind 0.0.0.0:10000"
echo ""
echo "3. Deploy to Vercel (Frontend):"
echo "   - Go to vercel.com"
echo "   - Import this GitHub repository"
echo "   - Output Directory: frontend"
echo "   - Set VITE_API_URL environment variable"
echo ""
echo "🎉 Setup complete! See DEPLOYMENT_GUIDE.md for detailed instructions"
