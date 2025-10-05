#!/bin/bash

# Albasari Backend Deployment Script
echo "🚀 Deploying Albasari Backend to Railway..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial backend setup"
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "⚠️  Railway CLI not found. Please install it first:"
    echo "   npm install -g @railway/cli"
    echo "   or visit: https://docs.railway.app/develop/cli"
    exit 1
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
fi

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "📊 Check your Railway dashboard for the deployment URL"
echo "🔧 Don't forget to set environment variables in Railway dashboard:"
echo "   - PORT=3001"
echo "   - JWT_SECRET=your-super-secret-jwt-key-12345"
echo "   - CMS_EMAIL=admin@albasari.com"
echo "   - CMS_PASSWORD=admin123"
