# 🚨 HOW TO FIX THE RAILWAY DEPLOYMENT CRASH

## Issue:
The backend crashed because the Procfile or start command is incorrect for the directory structure.

## Solution - Choose ONE:

### Option 1: Update Procfile (Recommended)
Replace the current Procfile with:
```
web: cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --timeout 60 --workers 2
```

### Option 2: Update Railway Start Command via Dashboard
1. Go to Railway dashboard
2. Click your service
3. Go to Settings → Start Command
4. Set it to:
```
cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --timeout 60 --workers 2
```

### Option 3: Move Procfile to backend/ folder
1. Move Procfile from root to backend/Procfile
2. Update content to:
```
web: gunicorn app:app --bind 0.0.0.0:$PORT --timeout 60 --workers 2
```

## After Fixing:
1. Click "Restart" button in Railway dashboard
2. Check logs to verify it starts
3. Test health endpoint: `https://your-service.railway.app/api/health`
4. If working, update frontend config.js with this URL

## Common Errors & Fixes:

❌ "No module named 'app'"
✅ Add `cd backend &&` to start command

❌ "ModuleNotFoundError"
✅ Make sure requirements.txt is in backend/ folder

❌ "Port already in use"
✅ Use $PORT environment variable (Railway sets this)

❌ "Timeout"
✅ Add `--timeout 60` to gunicorn command

## Verify Backend is Working:
```bash
curl https://your-railway-service.railway.app/api/health
```

Should return:
```json
{"status":"ok","service":"Password Strength Analyzer"}
```

