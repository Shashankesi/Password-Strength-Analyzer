/**
 * Frontend Configuration - API URL Setup
 * 
 * IMPORTANT: Update the API_BASE_URL below with your Render backend URL
 * 
 * For Local Development:
 *   API_BASE_URL = 'http://localhost:5000/api'
 * 
 * For Production (Vercel):
 *   API_BASE_URL = 'https://your-render-backend-url.render.com/api'
 *   Replace 'your-render-backend-url' with your actual Render service URL
 */

// ========================
// ⚙️  UPDATE THIS SECTION ⚙️  
// ========================

// Detect environment and set appropriate API URL
const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

let API_BASE_URL;

if (IS_LOCALHOST) {
  // Local Development
  API_BASE_URL = 'http://localhost:5000/api';
} else {
  // Production on Vercel - UPDATE THIS WITH YOUR RENDER URL
  // Example: 'https://password-strength-analyzer-backend.render.com/api'
  API_BASE_URL = 'https://password-strength-analyzer-backend.render.com/api';
  
  // Alternative: Read from environment variable if set
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) {
    API_BASE_URL = process.env.VITE_API_URL;
  }
}

// ========================
// Make API_BASE_URL global
// ========================
window.API_BASE_URL = API_BASE_URL;

// Debug info
console.log('%c🔌 API Configuration', 'color: #00ff00; font-weight: bold;');
console.log('Environment:', IS_LOCALHOST ? 'LOCAL' : 'PRODUCTION');
console.log('API URL:', API_BASE_URL);

// Warn if API URL looks unconfigured
if (API_BASE_URL.includes('password-strength-analyzer-backend.render.com') && !IS_LOCALHOST) {
  console.warn('%c⚠️  WARNING: Using default Render URL. Please update config.js with your actual backend URL!', 'color: #ff6600; font-weight: bold;');
}

