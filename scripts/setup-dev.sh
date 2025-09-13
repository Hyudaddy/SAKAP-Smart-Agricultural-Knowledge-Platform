#!/bin/bash

# Development setup script for SAKAP Agricultural Assistance Platform

echo "🌾 Setting up SAKAP Agricultural Assistance Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create environment files if they don't exist
if [ ! -f "frontend/.env" ]; then
    echo "🔧 Creating frontend .env file..."
    cat > frontend/.env << EOF
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000

# Google Gemini API Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key-here
VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

# Application Configuration
VITE_API_TIMEOUT=30000
VITE_ENABLE_OFFLINE_MODE=true
VITE_DEBUG_MODE=true
EOF
fi

if [ ! -f "backend/.env" ]; then
    echo "🔧 Creating backend .env file..."
    cat > backend/.env << EOF
# Backend Environment Variables
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:8080

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sakap-agri-assist

# JWT Configuration
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_EXPIRE=30d

# Google Gemini AI Configuration
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here

# File Upload Configuration
MAX_FILE_SIZE=10mb
UPLOAD_PATH=./uploads
EOF
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   npm run dev           # Start both frontend and backend"
echo "   npm run dev:frontend  # Start only frontend"
echo "   npm run dev:backend   # Start only backend"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:5000"
echo "   API:      http://localhost:5000/api"
echo ""
echo "📚 Next steps:"
echo "1. Update .env files with your API keys"
echo "2. Start MongoDB if using local database"
echo "3. Run 'npm run dev' to start development"