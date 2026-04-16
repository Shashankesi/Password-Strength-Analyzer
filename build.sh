#!/bin/bash

# This script is run by Vercel during the build process
# It creates the proper configuration file with environment variables

echo "🔨 Building Password Strength Analyzer Frontend..."

# Create environment config from environment variables
cat > frontend/env-config.js << 'EOF'
// Auto-generated configuration file
// This file is created during build process from environment variables

if (typeof window !== 'undefined') {
  // Get backend URL from environment variables or fallback
  const backendUrl = (
    process.env.RENDER_BACKEND_URL || 
    process.env.VITE_API_URL ||
    process.env.BACKEND_API_URL ||
    ''
  ).replace(/\/$/, ''); // Remove trailing slash if present
  
  // Set the API base URL globally
  if (backendUrl) {
    window.API_BASE_URL = `${backendUrl}/api`;
    console.log('✅ Backend URL configured:', window.API_BASE_URL);
  } else {
    console.warn('⚠️ No backend URL configured. Please set RENDER_BACKEND_URL environment variable.');
    window.API_BASE_URL = '/api'; // Fallback to relative path
  }
}
EOF

echo "✅ Configuration file generated"
echo "Frontend build complete!"
