# 🚀 Railway Deployment Guide

## **Quick Deploy to Railway**

### **Step 1: Prepare Your Repository**

1. **Initialize Git** (if not already done):

   ```bash
   git init
   git add .
   git commit -m "Initial backend setup"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/albasari-backend.git
   git push -u origin main
   ```

### **Step 2: Deploy to Railway**

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your `albasari-backend` repository**
6. **Railway will automatically detect it's a Node.js project**

### **Step 3: Set Environment Variables**

In your Railway project dashboard:

1. **Go to Variables tab**
2. **Add these environment variables**:
   ```
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-12345
   CMS_EMAIL=admin@albasari.com
   CMS_PASSWORD=admin123
   ```

### **Step 4: Deploy**

1. **Railway will automatically build and deploy**
2. **Wait for deployment to complete** (2-3 minutes)
3. **Get your URL** from the dashboard (e.g., `https://albasari-backend-production.up.railway.app`)

### **Step 5: Test Your Deployment**

```bash
# Health check
curl https://your-railway-url.up.railway.app/health

# Login test
curl -X POST https://your-railway-url.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@albasari.com","password":"admin123"}'
```

## 🔧 **Update Frontend Configuration**

After getting your Railway URL, update your frontend:

### **Update `lib/config.ts`**

```typescript
export const API_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://your-railway-url.up.railway.app" // Your Railway URL
      : "http://localhost:3001",
  // ... rest of config
};
```

### **Deploy Frontend to Vercel**

1. **Push your changes** to GitHub
2. **Vercel will automatically deploy** your frontend
3. **Test your CMS** in production

## 🎯 **Benefits of Railway**

- ✅ **Free tier** available
- ✅ **Automatic deployments** from GitHub
- ✅ **Easy environment variable management**
- ✅ **Built-in monitoring** and logs
- ✅ **HTTPS by default**
- ✅ **Global CDN**

## 🚨 **Important Notes**

1. **Keep your JWT_SECRET secure** - use a strong, random string
2. **Your Railway URL** will be your backend API endpoint
3. **Update frontend config** with the Railway URL
4. **Test everything** before going live

## 📊 **Monitoring**

Railway provides:

- **Real-time logs** in the dashboard
- **Deployment history**
- **Resource usage** monitoring
- **Error tracking**

## 🔄 **Updates**

To update your backend:

1. **Make changes** to your code
2. **Commit and push** to GitHub
3. **Railway automatically redeploys**

Your backend is now production-ready! 🎉
