@echo off
REM Vercel Setup Guide for Windows

echo.
echo Vercel Deployment Configuration
echo ================================
echo.
echo Please follow these steps:
echo.
echo 1. Make sure your Render backend is deployed
echo    - Go to https://render.com/dashboard
echo    - Copy your backend URL (e.g., https://myapp.render.com^)
echo.
echo 2. Update frontend/config.js
echo    Open frontend/config.js and update this line:
echo    production: 'https://your-render-url.render.com/api',
echo.
echo 3. Commit and push to GitHub
echo    git add .
echo    git commit -m "Update backend URL for production"
echo    git push origin main
echo.
echo 4. Vercel will auto-redeploy
echo    - Check https://vercel.com/dashboard for deployment status
echo.
echo 5. Test the deployment
echo    - Visit your Vercel URL
echo    - Enter a password and analyze
echo    - Open browser console (F12^) for debugging
echo.
echo Optional: Set Environment Variables in Vercel Dashboard
echo    Key: RENDER_BACKEND_URL
echo    Value: https://your-render-url.render.com
echo.
echo Setup complete!
echo.
pause
