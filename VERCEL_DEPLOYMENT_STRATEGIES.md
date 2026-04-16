# Vercel Deployment Configuration Guide

This file contains multiple deployment strategies for Vercel.

## Strategy 1: Frontend Only (Recommended)

Deploy frontend to Vercel and backend to Render.

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "framework": "other",
  "public": "frontend",
  "env": {
    "FLASK_ENV": "production"
  }
}
```

### Environment Variables in Vercel Dashboard
```
VITE_API_URL=https://your-backend.render.com/api
```

---

## Strategy 2: Backend + Frontend on Vercel

Use Vercel serverless functions for the backend (Python).

### vercel-serverless.json (rename to vercel.json)
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "framework": "other",
  "public": "frontend",
  "functions": {
    "backend/api/**.py": {
      "runtime": "python3.11"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/backend/api/$1"
    }
  ]
}
```

### Step 1: Create backend/api structure
```
backend/
├── api/
│   ├── __init__.py
│   └── analyze.py (convert app.py to serverless function)
├── app.py
└── requirements.txt
```

### Step 2: Convert Flask app to serverless function
See: https://vercel.com/docs/functions/serverless-functions/python

---

## Strategy 3: Monorepo Deployment

Deploy entire project including backend to Vercel.

### Steps:
1. Restructure backend as Vercel Functions
2. Frontend stays in `frontend/` folder
3. Set up environment variables for API communication
4. Deploy entire repository to Vercel

---

## Final Recommendation

**Use Strategy 1** (Frontend on Vercel + Backend on Render):
- ✅ Simpler setup
- ✅ Better separation of concerns
- ✅ Easier debugging
- ✅ Each part can be updated independently
- ✅ Free tier works fine

