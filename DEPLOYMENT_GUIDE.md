# Password Strength Analyzer - Deployment Guide

This guide covers deployment to **Vercel** (Frontend) and **Render** (Backend).

---

## 🚀 Option 1: Deploy to Vercel + Render (Recommended)

### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Connect GitHub Repository**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - Click "Connect"

3. **Configure Deployment**
   - **Name:** `password-strength-analyzer-backend`
   - **Region:** Select closest to you
   - **Branch:** `main`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:10000`
   - **Instance Type:** Free

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add these variables:
     - `FLASK_ENV` = `production`
     - `PYTHON_VERSION` = `3.11.0`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the deployed URL (e.g., `https://your-app.render.com`)

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `frontend`
   - **Root Directory:** (leave empty)

4. **Environment Variables**
   - Add Environment Variables:
     - **Key:** `VITE_API_URL`
     - **Value:** `https://your-backend-url.render.com/api` (replace with your Render URL)
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

6. **Update in Code**
   - Update `frontend/index.html` to include API URL:
   ```html
   <script>
     // Set API base URL from environment
     window.API_BASE_URL = '${VITE_API_URL}' || '/api';
   </script>
   ```

### Step 3: Test Deployment

1. Visit your Vercel URL
2. Try analyzing a password
3. Check browser console for errors
4. If "Failed to connect" error:
   - Verify Render backend is running
   - Check CORS is enabled in Flask (it is by default)
   - Verify API URL in environment variables

---

## 🐳 Option 2: Deploy Both to Render (Using Docker)

1. **Create `Dockerfile` in project root:**
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   # Copy requirements and install dependencies
   COPY backend/requirements.txt ./
   RUN pip install -r requirements.txt
   
   # Copy application files
   COPY backend/ ./backend/
   COPY frontend/ ./frontend/
   
   # Expose port
   EXPOSE 10000
   
   # Start Flask server
   CMD ["gunicorn", "backend.app:app", "--bind", "0.0.0.0:10000", "--timeout", "60"]
   ```

2. **Push to GitHub**
3. **Deploy to Render:**
   - New → Web Service
   - Select GitHub repo
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `gunicorn backend.app:app --bind 0.0.0.0:10000`
   - Environment: `FLASK_ENV=production`

---

## 🌐 Option 3: Deploy to Railway.app

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Add Python Service**
   - Add plugin → Python

4. **Configure**
   - **Start Command:** `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT`
   - Environment variable `PORT` is auto-set

5. **Deploy Frontend** (separately to Vercel)
   - Follow Vercel deployment steps above

---

## ✅ Troubleshooting

### "Failed to connect to API"
- ✓ Check backend is running: Visit `https://your-backend-url/api/health`
- ✓ Verify API URL in Vercel environment variables
- ✓ Check browser console for exact error
- ✓ Ensure CORS headers are correct

### Slow Performance
- ✓ Free tier services have limited resources
- ✓ Upgrade to paid plan for better performance
- ✓ Check backend logs for errors

### Frontend Not Loading
- ✓ Verify `npm run build` works locally
- ✓ Check that `frontend/` folder is in root directory
- ✓ Clear Vercel cache and redeploy

### Backend Won't Start
- ✓ Verify `requirements.txt` is correct
- ✓ Check environment variables
- ✓ View deployment logs for errors
- ✓ Ensure `gunicorn` is in requirements.txt

---

## 📝 Local Testing Before Deployment

```bash
# Test Backend Locally
cd backend
pip install -r requirements.txt
python app.py
# Visit: http://localhost:5000/api/health

# Test Frontend Locally (in another terminal)
cd frontend
python -m http.server 8000
# Visit: http://localhost:8000
```

---

## 🔒 Security Notes

1. **Always use HTTPS** in production
2. **Never commit** `.env` files with secrets
3. **Set `FLASK_DEBUG=False`** in production (already configured)
4. **Enable CORS carefully** - currently open to all origins for development
5. **Update dependencies** regularly: `pip list --outdated`

---

## 📊 Monitoring & Logs

### Render
- Dashboard → Your Service → "Logs" tab
- View real-time logs and errors

### Vercel
- Dashboard → Your Project → "Deployments" tab
- View build logs and errors

---

## 🎯 Next Steps

After successful deployment:

1. ✅ Test all features work correctly
2. ✅ Monitor logs for errors
3. ✅ Set up custom domain (optional)
4. ✅ Enable analytics
5. ✅ Plan scaling for high traffic

---

## 📞 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Check backend logs on Render/Railway
3. Check Vercel deployment logs
4. Review this guide's troubleshooting section
5. Open a GitHub issue with error details

