# 🚀 Deployment Checklist for Password Strength Analyzer

Complete this checklist before deploying to production.

## ✅ Pre-Deployment Verification

### Code Quality
- [ ] All code is committed to git
- [ ] No `console.log()` statements left in production code
- [ ] No sensitive data in code (API keys, passwords)
- [ ] Backend API error messages are safe (no stack traces)
- [ ] Frontend error handling is user-friendly

### Testing
- [ ] [ ] Backend runs locally: `python backend/app.py`
- [ ] API health check works: `curl http://localhost:5000/api/health`
- [ ] Frontend builds successfully: `npm run build`
- [ ] Frontend works locally with development backend
- [ ] Password analysis returns correct results
- [ ] History functionality works
- [ ] Password generator works
- [ ] Theme toggle works
- [ ] CSV export works
- [ ] Responsive design tested on mobile

### Security
- [ ] CORS is configured properly for production domains
- [ ] No hardcoded API URLs in frontend
- [ ] Werkzeug version is up to date
- [ ] Flask version is up to date
- [ ] HTTPS will be enforced in production
- [ ] No sensitive data in git history

### Configuration Files
- [ ] `requirements.txt` includes `gunicorn` and `python-dotenv`
- [ ] `.env.example` has all necessary variables
- [ ] `Procfile` is created for production deployment
- [ ] `vercel.json` is properly configured
- [ ] `render.yaml` is created for Render deployment (optional)

## 🚀 Deployment to Render (Backend)

### Preparation
- [ ] Push all changes to GitHub
- [ ] Create account at [render.com](https://render.com)
- [ ] GitHub repository is public or Render has access

### Deployment Steps
- [ ] Create new "Web Service"
- [ ] Select GitHub repository: `Password-Strength-Analyzer`
- [ ] Configure:
  - Set **Name:** `password-strength-analyzer-backend`
  - Set **Region:** Closest to your users
  - Set **Branch:** `main`
  - Set **Build Command:** `pip install -r requirements.txt`
  - Set **Start Command:** `gunicorn app:app --bind 0.0.0.0:10000 --timeout 60`

### Environment Variables (Render Dashboard)
- [ ] `FLASK_ENV` = `production`
- [ ] `PYTHON_VERSION` = `3.11.0`
- [ ] `CORS_ORIGINS` = `https://your-vercel-url.vercel.app,http://localhost:3000`

### Post-Deployment
- [ ] Copy backend URL (e.g., `https://password-strength-analyzer-backend.render.com`)
- [ ] Test health endpoint: `https://password-strength-analyzer-backend.render.com/api/health`
- [ ] Verify API responds to POST requests

## 🌐 Deployment to Vercel (Frontend)

### Preparation
- [ ] Render backend is deployed and working
- [ ] Copy Render backend URL
- [ ] Create account at [vercel.com](https://vercel.com)

### Deployment Steps
- [ ] Click "Add New Project" on Vercel
- [ ] Import GitHub repository
- [ ] Configure:
  - Set **Build Command:** `npm run build`
  - Set **Output Directory:** `frontend`
  - Set **Root Directory:** (leave empty)

### Environment Variables (Vercel Dashboard)
- [ ] `VITE_API_URL` = `https://password-strength-analyzer-backend.render.com/api`
  (Replace with your actual Render backend URL)

### Post-Deployment
- [ ] Copy Vercel frontend URL
- [ ] Visit the deployed URL in browser
- [ ] Test all features:
  - [ ] Password analysis works
  - [ ] History displays
  - [ ] CSV export works
  - [ ] Theme toggle works
  - [ ] No CORS errors in console

## 🔄 Continuous Deployment

After successful initial deployment:

- [ ] Git push automatically triggers Render rebuild (if configured)
- [ ] Git push automatically triggers Vercel rebuild (if configured)
- [ ] Rollback procedures defined (revert to previous deployment)
- [ ] Monitoring alerts set up (optional)

## 🐛 Troubleshooting

### Frontend shows "Failed to connect to API"
- [ ] Check Render backend is running
- [ ] Verify VITE_API_URL environment variable in Vercel
- [ ] Check browser console for exact error
- [ ] Test backend health check: `curl <backend-url>/api/health`
- [ ] Check CORS headers in browser DevTools

### Slow response times
- [ ] Check Render dashboard for resource usage
- [ ] Verify network latency (use appropriate region)
- [ ] Upgrade Render plan if on free tier
- [ ] Check backend computation time

### Build fails in Render
- [ ] Check build logs for specific error
- [ ] Verify Python version (should be 3.9+)
- [ ] Ensure `requirements.txt` is correct
- [ ] Check for missing dependencies

### Build fails in Vercel
- [ ] Check deployment logs
- [ ] Verify `npm run build` works locally
- [ ] Check for missing environment variables
- [ ] Verify `frontend/` folder structure

## 📊 Monitoring

### Render Metrics
- Check: Dashboard → Your Service → Metrics
- Monitor: CPU, Memory, Requests
- View: Real-time logs

### Vercel Analytics
- Check: Project → Analytics
- Monitor: Build time, Page load speed
- View: Deployment logs

## 🔐 Security Post-Deployment

- [ ] Enable HTTPS (automatically done by Render and Vercel)
- [ ] Configure domain (optional)
- [ ] Set up monitoring and alerts
- [ ] Review security headers
- [ ] Keep dependencies updated
- [ ] Regular security audits

## 🎯 Performance Optimization

- [ ] Minify frontend assets (npm run build does this)
- [ ] Enable gzip compression
- [ ] Cache static assets
- [ ] Optimize API response times
- [ ] Consider CDN for frontend (Vercel provides this)

## 📝 Documentation

- [ ] README.md updated with deployment links
- [ ] DEPLOYMENT_GUIDE.md complete and accurate
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Architecture diagram available

---

## ✅ Final Sign-Off

- [ ] Application is tested and working
- [ ] All security checks passed
- [ ] Documentation is complete
- [ ] Team is notified
- [ ] Monitoring is active

**Deployment Date:** _______________
**Deployed By:** _______________
**Notes:** _______________

---

## 🔄 Rollback Procedure

If critical issue found after deployment:

1. Go to Render Dashboard → Deployments
2. Select previous working deployment
3. Click "Redeploy"
4. Verify via: `<url>/api/health`

For Vercel:
1. Go to Vercel Dashboard → Deployments
2. Click menu on previous working deployment
3. Select "Promote to Production"

---

## 📞 Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Flask Documentation: https://flask.palletsprojects.com/
- CORS Documentation: https://flask-cors.readthedocs.io/

