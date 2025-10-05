# 🚀 Vercel Backend Deployment Guide

## **Deploy Express Backend to Vercel**

Your Express backend is now optimized for Vercel deployment with ES modules and proper configuration.

## 📋 **Deployment Steps**

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**

```bash
vercel login
```

### **Step 3: Deploy from Backend Directory**

```bash
cd albasari-backend
vercel
```

### **Step 4: Set Environment Variables**

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   ```
   JWT_SECRET=your-super-secret-jwt-key-12345
   CMS_EMAIL=admin@albasari.com
   CMS_PASSWORD=admin123
   NODE_ENV=production
   ```

### **Step 5: Redeploy**

```bash
vercel --prod
```

## 🔧 **Frontend Configuration**

After deployment, update your frontend configuration:

### **Update `lib/config.ts`**

```typescript
export const API_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://your-backend-url.vercel.app" // Your Vercel backend URL
      : "http://localhost:3001",
  // ... rest of config
};
```

## 🎯 **Vercel Benefits**

- ✅ **Fluid Compute** - Automatic scaling based on traffic
- ✅ **Preview Deployments** - Test changes before production
- ✅ **Instant Rollback** - Recover from issues in milliseconds
- ✅ **Vercel Firewall** - Built-in security protection
- ✅ **Global CDN** - Fast response times worldwide
- ✅ **Zero Configuration** - Works out of the box

## 📊 **API Endpoints**

Your backend will be available at:

- `https://your-backend-url.vercel.app/health`
- `https://your-backend-url.vercel.app/api/auth/login`
- `https://your-backend-url.vercel.app/api/projects`
- `https://your-backend-url.vercel.app/api/clients`
- `https://your-backend-url.vercel.app/api/services`

## 🧪 **Testing Your Deployment**

### **Health Check**

```bash
curl https://your-backend-url.vercel.app/health
```

### **Login Test**

```bash
curl -X POST https://your-backend-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@albasari.com","password":"admin123"}'
```

### **Get Projects**

```bash
curl https://your-backend-url.vercel.app/api/projects
```

## 🔄 **Development Workflow**

### **Local Development**

```bash
# Start backend locally
cd albasari-backend
vercel dev
```

### **Deploy Changes**

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 📁 **File Structure**

```
albasari-backend/
├── src/
│   └── server.js          # Main Express app
├── data/                   # JSON data files
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
└── README.md             # Documentation
```

## 🚨 **Important Notes**

1. **Environment Variables** - Set all required variables in Vercel dashboard
2. **Data Persistence** - JSON files are read-only in Vercel Functions
3. **Function Limits** - 250MB bundle size limit
4. **Error Handling** - Implement robust error handling for production

## 🎉 **Benefits Over Railway**

- ✅ **Better Integration** - Same platform as your frontend
- ✅ **Automatic Scaling** - Fluid compute handles traffic spikes
- ✅ **Preview Deployments** - Test changes safely
- ✅ **Global CDN** - Faster response times
- ✅ **Built-in Security** - Vercel Firewall protection
- ✅ **Zero Configuration** - Works immediately

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Module Import Errors**

   - Ensure `"type": "module"` in package.json
   - Use ES module syntax (`import`/`export`)

2. **Environment Variables**

   - Set all variables in Vercel dashboard
   - Redeploy after adding variables

3. **Data File Access**
   - JSON files are read-only in Vercel Functions
   - Consider using a database for production

### **Debug Commands**

```bash
# Check deployment logs
vercel logs

# Inspect deployment
vercel inspect

# Check function status
vercel functions
```

Your Express backend is now optimized for Vercel deployment! 🚀
