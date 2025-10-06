# 🚀 Render Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Deploy Your Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `kulleshshop/albishriksa.com-backend`
3. Configure:
   - **Name:** `albasari-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Instance Type:** `Free` (or `Starter` for always-on)

### Step 3: Set Environment Variables
In Render dashboard, go to your service → **Environment** tab:

```
MONGODB_URI=mongodb+srv://kulleshshopping_db_user:2thgQRLx6HCnjQWC@albaseri.gxpehzv.mongodb.net/albasari?retryWrites=true&w=majority&appName=albaseri
JWT_SECRET=albasari-super-secret-jwt-2024-change-this
CMS_EMAIL=info@albishriksa.com
CMS_PASSWORD=Admin@123
NODE_ENV=production
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Get your Render URL (e.g., `https://albasari-backend.onrender.com`)

### Step 5: Update Frontend
Update `lib/config.ts` with your new Render URL:

```typescript
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://albasari-backend.onrender.com" // Your Render URL
    : "http://localhost:3001";
```

## Benefits of Render:
- ✅ Simple deployment
- ✅ Good for Node.js + MongoDB
- ✅ Free tier available
- ✅ Easy environment variables
- ✅ Automatic HTTPS
- ✅ GitHub integration

## Cost:
- **Free:** Available (sleeps after 15min inactivity)
- **Starter:** $7/month (always running)
- **Perfect for:** Small to medium applications

## Test Your Deployment:
```bash
# Health check
curl https://albasari-backend.onrender.com/health

# Test projects
curl https://albasari-backend.onrender.com/api/projects
```

## Important Notes:
- **Free tier:** Service sleeps after 15 minutes of inactivity
- **Cold starts:** First request after sleep takes ~30 seconds
- **Upgrade to Starter:** For always-on service ($7/month)

## Support:
- Render has good documentation
- Active community
- Great for Node.js applications
