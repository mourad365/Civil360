# Fix 404 API Route Errors on Netlify

## Problem
You're getting 404 errors for `/api/auth/login` and `/api/auth/mock-login` on Netlify.

## Root Cause
The deployed version on Netlify is **outdated** and doesn't have the latest code changes. You need to:
1. Clear the old build
2. Redeploy with the new code

---

## 🚀 Solution - Follow These Steps Exactly

### Step 1: Commit All Changes
```bash
git add .
git commit -m "Fix Netlify API routes - remove mock-login dependency"
git push origin main
```

### Step 2: Clear Netlify Build Cache
1. Go to **Netlify Dashboard**
2. Click on your site (**civil360**)
3. Go to **Site settings** → **Build & deploy**
4. Scroll to **Build settings**
5. Click **Clear cache and retry deploy**

### Step 3: Trigger New Deploy
Option A - Automatic (if connected to Git):
- Netlify will auto-deploy after you push

Option B - Manual:
```bash
netlify deploy --prod
```

### Step 4: Verify Environment Variables Are Set
Go to **Site settings** → **Environment variables** and verify these exist:

- ✅ `MONGODB_URI`
- ✅ `MONGODB_DB_NAME`
- ✅ `JWT_SECRET`
- ✅ `JWT_EXPIRES_IN`
- ✅ `NODE_ENV` = `production`
- ✅ `SESSION_SECRET`

If any are missing, add them from `.env.production.example`

### Step 5: Check Build Logs
1. Go to **Deploys** tab in Netlify
2. Click on the latest deploy
3. Check the build log for errors
4. Look for:
   - ✅ "Build succeeded"
   - ✅ No TypeScript errors
   - ✅ API routes compiled

---

## 🔍 Why This Happens

The 404 errors mean:
1. **Old code is deployed** - The version on Netlify still has the old LoginForm.tsx that tries mock-login
2. **API routes not built** - Next.js API routes weren't compiled properly
3. **Cache issue** - Netlify is serving cached version

---

## ✅ Verification Steps

After redeploying, test:

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Visit** https://civil360.netlify.app
4. **Try to login**
5. **Check the Network tab** - you should see:
   - ✅ `POST /api/auth/login` → 200 OK (or 401 for wrong credentials)
   - ❌ NOT 404

---

## 🐛 Still Getting 404?

### Check 1: Verify Build Output
In Netlify build logs, look for:
```
Route (app)                              Size
┌ ○ /api/auth/login                      0 B
```

If you don't see API routes listed, the build failed.

### Check 2: Check Next.js Version
Your package.json should have:
```json
"next": "^14.2.0"
```

### Check 3: Verify File Structure
API routes must be at:
```
src/app/api/auth/login/route.ts  ✅
src/api/auth/login/route.ts      ❌ (wrong location)
```

### Check 4: Check for Build Errors
Look in Netlify build logs for:
- TypeScript errors
- Import errors
- Missing dependencies

---

## 📝 What Changed

**Before (causing 404s):**
```typescript
// LoginForm.tsx - OLD CODE
const mockRes = await fetch('/api/auth/mock-login', {
  method: 'POST',
  // ...
});
```

**After (fixed):**
```typescript
// LoginForm.tsx - NEW CODE
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

if (!res.ok) {
  const errorData = await res.json().catch(() => ({ error: 'Échec de la connexion' }));
  throw new Error(errorData.error || 'Identifiants invalides');
}
```

---

## 🔧 Emergency Workaround

If you need to test immediately and can't wait for deployment:

### Test Locally First
```bash
npm run build
npm start
```

Then visit http://localhost:3000 and verify login works.

If it works locally but not on Netlify, the issue is definitely deployment-related.

---

## 📞 Need More Help?

1. **Share Netlify build logs** - Copy the full build log from Netlify
2. **Check browser console** - Share any error messages
3. **Verify Git push worked** - Make sure latest code is in your repository

---

## Summary Checklist

- [ ] Committed and pushed all code changes
- [ ] Cleared Netlify build cache
- [ ] Triggered new deployment
- [ ] Verified environment variables are set
- [ ] Checked build logs for errors
- [ ] Tested login after deployment
- [ ] Verified API routes return 200/401, not 404
