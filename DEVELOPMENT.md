# 🚀 Development & Deployment Guide

## 🛠️ Local Development Setup

### Initial Setup (First Time)

```bash
# 1. Navigate to project directory
cd "NM new"

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
cd backend
pip install -r requirements.txt
cd ..

# 5. Start backend server (in one terminal)
cd backend
python app.py

# 6. In another terminal, serve frontend
cd frontend
python -m http.server 8000

# 7. Open http://localhost:8000 in your browser
```

### Daily Development Workflow

```bash
# Terminal 1: Backend Server
cd backend
python app.py

# Terminal 2: Frontend Server (optional, for development)
cd frontend
python -m http.server 8000

# Or simply open frontend/index.html in browser
# Both will work!
```

---

## 📊 Development Best Practices

### Backend (Flask)

1. **Enable Debug Mode** (Already enabled in app.py)
   ```python
   app.run(debug=True)
   ```
   - Auto-reloads on file changes
   - Shows detailed error pages

2. **Add Logging**
   ```python
   import logging
   logging.basicConfig(level=logging.DEBUG)
   logger = logging.getLogger(__name__)
   logger.debug('Message')
   ```

3. **Testing API Endpoints**
   ```bash
   # Using curl
   curl -X POST http://localhost:5000/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"password":"Test123!@#"}'
   
   # Or use Postman/Insomnia GUI tools
   ```

### Frontend (JavaScript)

1. **Browser Developer Tools**
   - F12 to open DevTools
   - Console tab for errors
   - Network tab for API calls
   - Performance tab for optimization

2. **Code Organization**
   - Keep functions modular
   - Use meaningful variable names
   - Comment complex logic
   - Test in multiple browsers

3. **Performance Testing**
   - Use Lighthouse in DevTools
   - Check Core Web Vitals
   - Monitor API response times

---

## 🔧 Configuration for Different Environments

### Development Environment
```python
# backend/app.py
app.run(
    debug=True,
    host='127.0.0.1',  # Local only
    port=5000
)
```

### Production Environment
```python
# Use environment variables
import os
app.run(
    debug=False,
    host='0.0.0.0',  # All interfaces
    port=int(os.environ.get('PORT', 5000)),
    ssl_context='adhoc'  # HTTPS
)
```

---

## 🐳 Docker Development

### Create Docker Image

```dockerfile
# Dockerfile (in backend directory)
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "app.py"]
```

### Build and Run

```bash
# Build image
docker build -t password-analyzer:latest .

# Run container
docker run -p 5000:5000 password-analyzer:latest

# Run in background
docker run -d -p 5000:5000 --name psa password-analyzer:latest

# View logs
docker logs psa

# Stop container
docker stop psa
```

### Docker Compose (Frontend + Backend)

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: production
      FLASK_DEBUG: 0
    volumes:
      - ./backend:/app

  frontend:
    image: nginx:alpine
    ports:
      - "8000:80"
    volumes:
      - ./frontend:/usr/share/nginx/html
    depends_on:
      - backend
```

Run with:
```bash
docker-compose up
```

---

## ☁️ Cloud Deployment

### Heroku Deployment (Backend)

1. **Prepare Heroku Files:**
   ```bash
   # Create Procfile
   echo "web: gunicorn app:app" > Procfile
   
   # Update requirements.txt
   pip install gunicorn
   pip freeze > requirements.txt
   ```

2. **Deploy:**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   heroku logs --tail
   ```

3. **Update Frontend API URL:**
   ```javascript
   // script.js
   const API_BASE_URL = 'https://your-app-name.herokuapp.com/api';
   ```

### Vercel Deployment (Frontend)

1. **Connect Repository:**
   - Push code to GitHub
   - Connect to Vercel dashboard
   - Deploy from `frontend` directory

2. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

### AWS Deployment

1. **Backend (EC2 + Gunicorn + Nginx):**
   ```bash
   # On EC2 instance
   sudo yum update -y
   sudo yum install python3 -y
   
   git clone your-repo
   cd your-repo/backend
   
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Frontend (S3 + CloudFront):**
   ```bash
   # Upload frontend directory to S3
   aws s3 sync ./frontend s3://your-bucket-name
   
   # Configure CloudFront distribution
   ```

### Azure Deployment

```bash
# Create resource group
az group create --name psa-group --location eastus

# Create App Service Plan
az appservice plan create \
  --name psa-plan \
  --resource-group psa-group \
  --sku B1 --is-linux

# Create Web App
az webapp create \
  --resource-group psa-group \
  --plan psa-plan \
  --name your-app-name \
  --runtime "PYTHON|3.9"
```

---

## 📋 Testing

### Manual Testing Checklist

- [ ] Input field accepts all character types
- [ ] Show/Hide password toggle works
- [ ] Generate password creates strong passwords
- [ ] Strength meter animates smoothly
- [ ] Charts render without errors
- [ ] Recommendations appear correctly
- [ ] History saves previous analyses
- [ ] CSV export downloads file
- [ ] Theme toggle works in both modes
- [ ] Mobile responsive on small screens
- [ ] Copy button works
- [ ] API errors handled gracefully

### Automated Testing

```bash
# Backend unit tests
pytest backend/tests/

# Frontend tests (if added)
npm test

# Load testing
ab -n 1000 -c 10 http://localhost:5000/api/health
```

---

## 🔍 Debugging

### Backend Debugging

```python
# Add debug prints
print("Analysis result:", result)

# Use Python debugger
import pdb
pdb.set_trace()

# Or use logging
import logging
logger = logging.getLogger(__name__)
logger.debug(f"Password length: {len(password)}")
```

### Frontend Debugging

```javascript
// Console logging
console.log('Analysis result:', result);
console.error('Error occurred:', error);

// Debugger statement
debugger;  // Sets breakpoint in DevTools

// Network inspection in DevTools
// Check Network tab for API calls
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions

**Issue: CORS Error**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
Solution:
- Ensure Flask-CORS is installed
- Check API_BASE_URL matches backend host
- Install: `pip install Flask-CORS`

**Issue: Charts Not Rendering**
```
Canvas is not available
```
Solution:
- Verify Chart.js CDN is loaded
- Check chart container has height
- Clear browser cache

**Issue: API Returns 500 Error**
```
Internal Server Error
```
Solution:
- Check Flask server logs
- Verify password parameter is sent
- Test with curl: `curl -X POST http://localhost:5000/api/analyze -H "Content-Type: application/json" -d '{"password":"test"}'`

**Issue: Slow Performance**
```
Analysis takes > 1 second
```
Solution:
- Reduce debounce delay (if desired)
- Check system CPU usage
- Optimize chart rendering

---

## 📦 Building for Production

### Backend Build

```bash
# Install production dependencies only
pip install -r requirements.txt --no-dev

# Run with production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Or with uWSGI
pip install uwsgi
uwsgi --http :5000 --wsgi-file app.py --callable app
```

### Frontend Build

```bash
# Minify CSS
csso style.css -o style.min.css

# Minify JavaScript
npx terser script.js -o script.min.js

# Update index.html to use minified versions
```

### Environment Setup

Before deploying:
1. Create `.env` file with production secrets
2. Set `FLASK_ENV=production`
3. Generate strong `SECRET_KEY`
4. Enable HTTPS/SSL
5. Set up environment variables for sensitive data

---

## 📈 Performance Optimization

### Backend
```python
# Enable caching
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/analyze')
@cache.cached(timeout=300)
def analyze_password():
    ...

# Use compression
from flask_compress import Compress
Compress(app)
```

### Frontend
```javascript
// Lazy load Chart.js
const script = document.createElement('script');
script.async = true;
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(script);

// Debounce analysis
const analyzePassword = debounce(() => {
    // analysis logic
}, 300);

// Use LocalStorage for theme
localStorage.setItem('theme', 'dark');
```

---

## 🔐 Security Checklist

- [ ] Enable HTTPS/SSL in production
- [ ] Set secure CORS origins (not `*`)
- [ ] Implement rate limiting on API endpoints
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Run security audit: `pip audit`
- [ ] Enable CSRF protection if needed
- [ ] Set secure headers (CSP, X-Frame-Options, etc.)
- [ ] Regular penetration testing

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Happy Development! 🎉**
