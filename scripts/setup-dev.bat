@echo off
REM Development setup script for SAKAP Agricultural Assistance Platform (Windows)

echo 🌾 Setting up SAKAP Agricultural Assistance Platform...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    exit /b 1
)

echo ✅ Node.js version:
node -v

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

REM Create environment files if they don't exist
if not exist "frontend\.env" (
    echo 🔧 Creating frontend .env file...
    (
        echo # Backend API Configuration
        echo VITE_API_BASE_URL=http://localhost:5000/api
        echo VITE_BACKEND_URL=http://localhost:5000
        echo.
        echo # Google Gemini API Configuration
        echo VITE_GEMINI_API_KEY=your-gemini-api-key-here
        echo VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
        echo.
        echo # Application Configuration
        echo VITE_API_TIMEOUT=30000
        echo VITE_ENABLE_OFFLINE_MODE=true
        echo VITE_DEBUG_MODE=true
    ) > frontend\.env
)

if not exist "backend\.env" (
    echo 🔧 Creating backend .env file...
    (
        echo # Backend Environment Variables
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Frontend URL for CORS
        echo FRONTEND_URL=http://localhost:8080
        echo.
        echo # Database Configuration
        echo MONGODB_URI=mongodb://localhost:27017/sakap-agri-assist
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=dev-jwt-secret-change-in-production
        echo JWT_EXPIRE=30d
        echo.
        echo # Google Gemini AI Configuration
        echo GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here
        echo.
        echo # File Upload Configuration
        echo MAX_FILE_SIZE=10mb
        echo UPLOAD_PATH=./uploads
    ) > backend\.env
)

echo ✅ Setup complete!
echo.
echo 🚀 To start development:
echo    npm run dev           # Start both frontend and backend
echo    npm run dev:frontend  # Start only frontend
echo    npm run dev:backend   # Start only backend
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:8080
echo    Backend:  http://localhost:5000
echo    API:      http://localhost:5000/api
echo.
echo 📚 Next steps:
echo 1. Update .env files with your API keys
echo 2. Start MongoDB if using local database
echo 3. Run 'npm run dev' to start development

pause