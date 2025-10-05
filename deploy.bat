@echo off
echo 🚀 Deploying Albasari Backend to Railway...

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial backend setup"
)

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Railway CLI not found. Please install it first:
    echo    npm install -g @railway/cli
    echo    or visit: https://docs.railway.app/develop/cli
    pause
    exit /b 1
)

REM Login to Railway (if not already logged in)
echo 🔐 Checking Railway authentication...
railway whoami >nul 2>&1
if errorlevel 1 (
    echo Please login to Railway:
    railway login
)

REM Deploy to Railway
echo 🚀 Deploying to Railway...
railway up

echo ✅ Deployment complete!
echo 📊 Check your Railway dashboard for the deployment URL
echo 🔧 Don't forget to set environment variables in Railway dashboard:
echo    - PORT=3001
echo    - JWT_SECRET=your-super-secret-jwt-key-12345
echo    - CMS_EMAIL=admin@albasari.com
echo    - CMS_PASSWORD=admin123
pause
