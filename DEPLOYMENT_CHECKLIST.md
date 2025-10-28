# 🚀 Netlify Deployment Checklist

Use this checklist to ensure successful deployment.

---

## ✅ Pre-Deployment Checklist

- [ ] All code changes are saved
- [ ] Local build works: `npm run build` (no errors)
- [ ] Local server works: `npm start` and test login at http://localhost:3000
- [ ] MongoDB database is populated (run `npm run populate` if needed)

---

## ✅ Git & Code Checklist

- [ ] All files are committed:
  ```bash
  git status  # Should show "nothing to commit"
  ```
- [ ] Changes are pushed to remote:
  ```bash
  git push origin main
  ```
- [ ] Verify on GitHub/GitLab that latest commit is visible

---

## ✅ Netlify Configuration Checklist

### Environment Variables (CRITICAL!)

Go to: **Netlify Dashboard → Site Settings → Environment Variables**

- [ ] `MONGODB_URI` is set
- [ ] `MONGODB_DB_NAME` = `civil360`
- [ ] `JWT_SECRET` is set (use strong secret in production!)
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `NODE_ENV` = `production`
- [ ] `SESSION_SECRET` is set

### Build Settings

Go to: **Site Settings → Build & deploy → Build settings**

- [ ] Build command: `npm run build`
- [ ] Node version: `20` (set in netlify.toml)
- [ ] Branch to deploy: `main` (or `master`)

---

## ✅ Deployment Checklist

- [ ] Clear build cache:
  - Go to: **Site Settings → Build & deploy**
  - Click: **"Clear cache and retry deploy"**

- [ ] Trigger new deployment:
  - Option 1: Push to Git (auto-deploys)
  - Option 2: Click **"Trigger deploy"** in Netlify
  - Option 3: Run `netlify deploy --prod`

- [ ] Wait for build to complete (2-5 minutes)

- [ ] Check build logs for errors:
  - Go to: **Deploys** tab
  - Click latest deploy
  - Read the build log
  - Look for "Build succeeded" message

---

## ✅ MongoDB Atlas Checklist

- [ ] Database `civil360` exists
- [ ] Users collection has data (run `npm run populate` if empty)
- [ ] Network Access allows Netlify:
  - Go to: **Network Access** in MongoDB Atlas
  - Add IP: **0.0.0.0/0** (Allow from anywhere)
  - Or add Netlify's specific IP ranges

- [ ] Database user credentials are correct
- [ ] Connection string in `MONGODB_URI` is valid

---

## ✅ Post-Deployment Testing

### Test 1: Site Loads
- [ ] Visit: https://civil360.netlify.app
- [ ] Page loads without errors
- [ ] No console errors (F12 → Console tab)

### Test 2: API Routes Work
- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Try to login with any credentials
- [ ] Check Network tab:
  - [ ] `POST /api/auth/login` appears
  - [ ] Status is **200** (success) or **401** (wrong password)
  - [ ] Status is NOT **404** or **500**

### Test 3: Authentication Works
- [ ] Enter correct username/password (from populate.js)
- [ ] Click "Se connecter"
- [ ] Should redirect to `/dashboard`
- [ ] Dashboard loads with user data

### Test 4: Wrong Credentials
- [ ] Enter wrong username/password
- [ ] Click "Se connecter"
- [ ] Should show error message
- [ ] Should NOT crash or show 500 error

---

## ✅ Verification Commands

Run these locally to verify before deploying:

```bash
# Check Git status
git status

# Test build locally
npm run build

# Test production build locally
npm start
# Then visit http://localhost:3000

# Check for TypeScript errors
npm run check

# View environment variables (local)
cat .env.example
```

---

## ❌ Common Issues & Solutions

### Issue: 404 on API routes
**Solution:**
- Clear Netlify build cache
- Verify latest code is pushed to Git
- Check build logs for errors

### Issue: 500 on login
**Solution:**
- Check MongoDB connection string
- Verify environment variables are set
- Check Netlify function logs

### Issue: "Service de base de données indisponible"
**Solution:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas Network Access
- Verify database user credentials

### Issue: "Identifiants invalides" (but credentials are correct)
**Solution:**
- Verify database has users (run `npm run populate`)
- Check `MONGODB_DB_NAME` matches database name
- Verify password hashing is working

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Site loads at https://civil360.netlify.app
- ✅ No 404 errors on API routes
- ✅ Login works with correct credentials
- ✅ Dashboard loads after login
- ✅ No console errors in browser
- ✅ Netlify build logs show "Build succeeded"

---

## 📊 Monitoring

After deployment, monitor:

- **Netlify Function Logs**: Check for runtime errors
- **Browser Console**: Check for client-side errors
- **MongoDB Atlas Metrics**: Monitor database connections
- **Netlify Analytics**: Track site performance

---

## 🔄 Redeployment Process

If you need to redeploy after making changes:

1. Make code changes
2. Test locally: `npm run build && npm start`
3. Commit: `git add . && git commit -m "Your message"`
4. Push: `git push origin main`
5. Clear Netlify cache (if needed)
6. Wait for auto-deployment
7. Test on production URL

---

## 📝 Quick Reference

**Netlify Dashboard:** https://app.netlify.com
**Your Site:** https://civil360.netlify.app
**MongoDB Atlas:** https://cloud.mongodb.com

**Test Credentials:** (from populate.js)
- Username: `admin`
- Check populate.js for password

---

## 🆘 Emergency Rollback

If deployment breaks production:

1. Go to Netlify **Deploys** tab
2. Find last working deployment
3. Click **"Publish deploy"** on that version
4. Fix issues locally
5. Redeploy when ready

---

**Last Updated:** After fixing 404 API route errors
**Status:** Ready for deployment ✅
