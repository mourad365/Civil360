# 404 API Route Errors - Quick Fix Guide

## 🔴 Current Problem

Your Netlify deployment is returning **404 errors** for API routes:
- `POST /api/auth/login` → 404
- `POST /api/auth/mock-login` → 404

## 🎯 Root Cause

**The deployed code on Netlify is OUTDATED.** 

The error logs show the old version of `LoginForm.tsx` is still trying to call `/api/auth/mock-login`, which means:
1. Your local code changes haven't been deployed yet
2. Netlify is serving a cached/old build

## ✅ Solution (3 Steps)

### Step 1: Push Your Changes

Run this PowerShell script:
```powershell
.\redeploy.ps1
```

Or manually:
```bash
git add .
git commit -m "Fix Netlify deployment - remove mock-login"
git push origin main
```

### Step 2: Clear Netlify Cache

**CRITICAL:** You must clear the build cache!

1. Go to https://app.netlify.com
2. Click your **civil360** site
3. Navigate to: **Site settings** → **Build & deploy**
4. Click: **"Clear cache and retry deploy"**

### Step 3: Verify Environment Variables

Go to: **Site settings** → **Environment variables**

Make sure these 6 variables exist:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://mourad2:mourad2@cluster0.mwhno36.mongodb.net/?retryWrites=true&w=majority` |
| `MONGODB_DB_NAME` | `civil360` |
| `JWT_SECRET` | `civil360-super-secret-jwt-key-2024-production-ready` |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | `your-super-secret-session-key-change-in-production` |

---

## 🔍 How to Verify It's Fixed

After redeployment (wait 2-5 minutes):

1. **Open** https://civil360.netlify.app
2. **Press F12** to open DevTools
3. **Go to Network tab**
4. **Try to login** with any credentials
5. **Check the Network tab:**
   - ✅ Should see: `POST /api/auth/login` → **200** (success) or **401** (wrong password)
   - ❌ Should NOT see: **404** errors

---

## 📊 What Changed

### Before (OLD - causing 404s):
```typescript
// This is what's currently deployed on Netlify
const mockRes = await fetch('/api/auth/mock-login', {
  method: 'POST',
  body: JSON.stringify({ role: 'general_director' }),
});
```

### After (NEW - in your local code):
```typescript
// This is what you have locally (correct)
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});
```

---

## 🚨 Important Notes

### Why "Clear Cache" is Critical
Netlify caches builds for performance. Without clearing the cache:
- Old JavaScript bundles are served
- Old API routes are used
- Your new code won't be deployed

### Why You See Mock-Login Errors
The browser console shows attempts to call `/api/auth/mock-login` because:
- The deployed JavaScript still has the OLD LoginForm code
- We removed mock-login from local code, but it's not deployed yet

---

## 🐛 Troubleshooting

### Still Getting 404 After Redeployment?

**Check Build Logs:**
1. Go to Netlify Dashboard
2. Click **Deploys** tab
3. Click the latest deploy
4. Read the build log

**Look for:**
- ✅ "Build succeeded" message
- ✅ API routes listed in build output
- ❌ TypeScript errors
- ❌ Import/module errors

**Common Issues:**
- MongoDB connection string has typo
- Environment variables not set
- Build failed but you didn't notice

### API Routes Not Found in Build Output?

If the build log doesn't show API routes like:
```
Route (app)                              Size
┌ ○ /api/auth/login                      0 B
```

Then the build failed. Check for:
- TypeScript compilation errors
- Missing dependencies
- Import path issues

---

## 📁 Files You Modified

These files have been updated locally (need to be deployed):

1. ✅ `src/components/auth/LoginForm.tsx` - Removed mock-login fallback
2. ✅ `src/app/api/auth/login/route.ts` - Added DB init and error handling
3. ✅ `netlify.toml` - Simplified configuration
4. ✅ `next.config.mjs` - Removed standalone mode

---

## ⚡ Quick Command Reference

```bash
# Check what's not committed
git status

# Commit everything
git add .
git commit -m "Fix Netlify deployment"

# Push to trigger deployment
git push origin main

# Or use the PowerShell script
.\redeploy.ps1
```

---

## 🎯 Expected Result

After successful deployment:

1. ✅ Login page loads
2. ✅ Enter username/password
3. ✅ Click "Se connecter"
4. ✅ API call to `/api/auth/login` returns 200 or 401 (NOT 404)
5. ✅ If credentials correct → redirect to dashboard
6. ✅ If credentials wrong → error message shown

---

## 📞 Still Stuck?

If you're still getting 404s after following all steps:

1. **Share Netlify build logs** - Copy the entire build log
2. **Share browser console** - Screenshot of Network tab errors
3. **Verify Git push** - Confirm latest commit is in your repository
4. **Check Netlify site** - Confirm it's connected to correct Git repo/branch

---

## 📚 Additional Resources

- `DEPLOY_FIX_404.md` - Detailed troubleshooting guide
- `NETLIFY_DEPLOYMENT_GUIDE.md` - Complete deployment documentation
- `QUICK_DEPLOY_NETLIFY.md` - Quick start guide
- `.env.production.example` - Environment variables template

---

**TL;DR:** Your code is correct locally, but Netlify has the old version. Push your changes and clear Netlify's build cache.
