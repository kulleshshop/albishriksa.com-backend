# 🚀 Railway Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Deploy Your Backend

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `kulleshshop/albishriksa.com-backend`
4. Railway will automatically detect it's a Node.js project

### Step 3: Set Environment Variables

In Railway dashboard, go to your project → **Variables** tab:

```
MONGODB_URI=mongodb+srv://kulleshshopping_db_user:2thgQRLx6HCnjQWC@albaseri.gxpehzv.mongodb.net/albasari?retryWrites=true&w=majority&appName=albaseri
JWT_SECRET=albasari-super-secret-jwt-2024-change-this
CMS_EMAIL=info@albishriksa.com
CMS_PASSWORD=Admin@123
NODE_ENV=production
```

### Step 4: Deploy

1. Railway will automatically deploy
2. Wait 2-3 minutes
3. Get your Railway URL (e.g., `https://your-app.railway.app`)

### Step 5: Update Frontend

Update `lib/config.ts` with your new Railway URL:

```typescript
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-app.railway.app" // Your Railway URL
    : "http://localhost:3001";
```

## Benefits of Railway:

- ✅ Always running (no cold starts)
- ✅ Built for Node.js + MongoDB
- ✅ $5/month after free credits
- ✅ Easy environment variables
- ✅ Automatic HTTPS
- ✅ GitHub integration

## Cost:

- **Free:** $5 credit monthly
- **Paid:** $5/month for basic plan
- **Perfect for:** Small to medium applications

## Test Your Deployment:

```bash
# Health check
curl https://your-app.railway.app/health

# Test projects
curl https://your-app.railway.app/api/projects
```

## Support:

- Railway has excellent documentation
- Active community
- Great for Node.js applications
