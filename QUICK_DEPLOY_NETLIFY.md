# Quick Netlify Deployment Fix

## What Was Wrong?

Your app was trying to use **mock-login** (development-only feature) in production, causing 403 errors.

## What Was Fixed?

✅ Removed mock-login dependency from production code
✅ Added proper error handling for database connections
✅ Created Netlify configuration file
✅ Updated Next.js config for Netlify compatibility

---

## 🚀 Deploy Now - 3 Steps

### Step 1: Set Environment Variables in Netlify

Go to: **Netlify Dashboard** → **Your Site** → **Site settings** → **Environment variables**

Click **"Add a variable"** and add these **6 variables**:

```
MONGODB_URI = mongodb+srv://mourad2:mourad2@cluster0.mwhno36.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME = civil360
JWT_SECRET = civil360-super-secret-jwt-key-2024-production-ready
JWT_EXPIRES_IN = 7d
NODE_ENV = production
SESSION_SECRET = your-super-secret-session-key-change-in-production
```

### Step 2: Allow Netlify to Access MongoDB

1. Go to **MongoDB Atlas** → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 3: Deploy

```bash
# Commit the fixes
git add .
git commit -m "Fix production authentication for Netlify"
git push

# Or use Netlify CLI
netlify deploy --prod
```

---

## 🔐 Login Credentials

After deployment, use these credentials (from your populate.js):

- **Username**: `admin`
- **Email**: `admin@civil360.com`
- **Password**: Check your `populate.js` file for the admin password

---

## ✅ Verify Deployment

1. Visit: `https://civil360.netlify.app`
2. Enter username and password
3. You should be redirected to `/dashboard`

---

## ❌ Still Getting Errors?

### Check Netlify Function Logs
1. Go to Netlify Dashboard
2. Click on your site
3. Go to **Functions** tab
4. Click on **next** function
5. View the logs for errors

### Common Issues

**Error: "Service de base de données indisponible"**
- ✓ Check MongoDB URI is correct in Netlify env vars
- ✓ Verify MongoDB Atlas allows connections from 0.0.0.0/0
- ✓ Check MongoDB user credentials

**Error: "Identifiants invalides"**
- ✓ Make sure you ran `npm run populate` to create users
- ✓ Use correct username/password from populate.js
- ✓ Verify database name is `civil360`

---

## 📝 Files Changed

- ✅ `src/components/auth/LoginForm.tsx` - Removed mock-login
- ✅ `src/app/api/auth/login/route.ts` - Added DB init
- ✅ `next.config.mjs` - Removed standalone mode
- ✅ `netlify.toml` - Created Netlify config

---

## Need More Help?

See the detailed guide: `NETLIFY_DEPLOYMENT_GUIDE.md`
