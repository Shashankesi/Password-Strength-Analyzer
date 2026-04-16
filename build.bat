@echo off
REM Windows build script for Vercel
REM This creates the configuration file with environment variables during build

echo Building Password Strength Analyzer Frontend...

REM Create environment config from environment variables
(
  echo // Auto-generated configuration file
  echo // This file is created during build process from environment variables
  echo.
  echo if (typeof window !== 'undefined') {
  echo   // Get backend URL from environment variables or fallback
  echo   const backendUrl = (
  echo     '%RENDER_BACKEND_URL%' ^^|^^^| 
  echo     '%VITE_API_URL%' ^^|^^^| 
  echo     '%BACKEND_API_URL%' ^^|^^^| 
  echo     ''
  echo   ^).replace(/\/$/, ''); // Remove trailing slash if present
  echo.
  echo   // Set the API base URL globally
  echo   if (backendUrl^) {
  echo     window.API_BASE_URL = backendUrl + '/api';
  echo     console.log('✅ Backend URL configured:', window.API_BASE_URL^);
  echo   } else {
  echo     console.warn('⚠️ No backend URL configured. Please set RENDER_BACKEND_URL environment variable.'^);
  echo     window.API_BASE_URL = '/api'; // Fallback to relative path
  echo   }
  echo }
) > frontend\env-config.js

echo Configuration file generated
echo Frontend build complete!
pause
