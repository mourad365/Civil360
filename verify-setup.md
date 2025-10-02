# Verification Guide - Civil360 Single-Port Setup

## ✅ Quick Verification Checklist

### 1. File Structure Verification

**API Routes Created (18 files):**
- [x] `/api/auth/mock-login/route.ts`
- [x] `/api/auth/register/route.ts`
- [x] `/api/auth/login/route.ts`
- [x] `/api/auth/me/route.ts`
- [x] `/api/auth/change-password/route.ts`
- [x] `/api/auth/refresh/route.ts`
- [x] `/api/dashboard/stats/route.ts`
- [x] `/api/dashboard/general-director/route.ts`
- [x] `/api/projects/route.ts`
- [x] `/api/projects/[id]/route.ts`
- [x] `/api/equipment/route.ts`
- [x] `/api/equipment/[id]/route.ts`
- [x] `/api/purchasing/orders/route.ts`
- [x] `/api/purchasing/orders/[id]/route.ts`
- [x] `/api/notifications/route.ts`
- [x] `/api/notifications/[id]/read/route.ts`
- [x] `/api/notifications/read-all/route.ts`
- [x] `/api/notifications/stats/route.ts`

**Helper Libraries:**
- [x] `src/lib/auth-helpers.ts`
- [x] `src/lib/db-init.ts`

**Configuration:**
- [x] `package.json` - Updated scripts
- [x] `next.config.mjs` - Removed API rewrites
- [x] `.env` - MongoDB and JWT settings

### 2. Test Commands

Run these commands to verify everything works:

```bash
# 1. Check Node version (should be 18+)
node --version

# 2. Check if dependencies are installed
npm list next mongoose jsonwebtoken

# 3. Test TypeScript compilation
npm run check

# 4. Verify MongoDB connection (if running locally)
mongosh --eval "db.version()"

# 5. Start development server
npm run dev
```

### 3. Manual Testing Steps

#### Step 1: Start the Application
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

#### Step 2: Test Home Page
Open browser: `http://localhost:3000`

**Expected:** Home page loads without errors

#### Step 3: Test API Routes
Open DevTools Network tab and test these endpoints:

**Test Dashboard Stats:**
```
GET http://localhost:3000/api/dashboard/stats
```

**Test Projects:**
```
GET http://localhost:3000/api/projects
```

**Test Mock Login:**
```bash
# Using curl (PowerShell)
curl -X POST http://localhost:3000/api/auth/mock-login `
  -H "Content-Type: application/json" `
  -d '{"role":"general_director"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Mock login successful",
  "user": { ... },
  "token": "eyJ..."
}
```

#### Step 4: Test Dashboard Pages

Navigate to each dashboard:
- `http://localhost:3000/dashboard/general-director`
- `http://localhost:3000/dashboard/project-engineer`
- `http://localhost:3000/dashboard/purchasing`
- `http://localhost:3000/dashboard/equipment`

**Expected:** Each page loads with mock authentication in development mode

### 4. Database Verification

```bash
# Populate database with sample data
npm run populate
```

**Expected Output:**
```
✓ Connected to MongoDB
✓ Created roles
✓ Created users
✓ Created projects
✓ Database populated successfully
```

**Verify in MongoDB:**
```bash
mongosh civil360 --eval "db.users.countDocuments()"
mongosh civil360 --eval "db.projects.countDocuments()"
```

### 5. Production Build Test

```bash
# Build for production
npm run build
```

**Expected:** Build completes without errors

```bash
# Start production server
npm start
```

**Expected:** Server starts on port 3000

## 🔍 Common Issues & Solutions

### Issue: Port 3000 Already in Use

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Issue: MongoDB Connection Failed

**Solution:**
```powershell
# Check MongoDB service status
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Or use MongoDB Compass to verify connection
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Clean and rebuild
npm run clean
rm -rf node_modules
npm install
npm run build
```

### Issue: API Routes Return 404

**Check:**
1. File is named `route.ts` (not `routes.ts`)
2. File is in correct directory under `src/app/api/`
3. Restart dev server
4. Clear browser cache

### Issue: Authentication Not Working

**Check:**
1. `.env` file has `JWT_SECRET` set
2. `NODE_ENV=development` for mock auth
3. Check browser console for errors
4. Verify `src/lib/auth-helpers.ts` is importing correctly

## ✨ Success Indicators

You'll know everything is working when:

1. ✅ `npm run dev` starts without errors
2. ✅ Application loads at `http://localhost:3000`
3. ✅ Dashboard pages render correctly
4. ✅ API routes respond (check Network tab)
5. ✅ No console errors in browser
6. ✅ MongoDB connects (check terminal output)
7. ✅ Mock authentication works in development
8. ✅ Production build succeeds

## 📊 Performance Check

After starting the app, verify:

- **First Load:** Page loads in < 2 seconds
- **API Response:** < 500ms for dashboard stats
- **Hot Reload:** Changes reflect in < 1 second
- **Memory Usage:** < 500MB for dev server

## 🎯 Next Steps After Verification

1. **Explore the Codebase**
   - Review API routes in `src/app/api/`
   - Check authentication helpers in `src/lib/`
   - Understand MongoDB models in `src/server/models/`

2. **Customize**
   - Add your own API routes
   - Extend authentication logic
   - Create new dashboard pages

3. **Deploy**
   - Push to GitHub
   - Deploy to Vercel (recommended)
   - Or use Docker/PM2 for VPS

## 📝 Documentation References

- **START_HERE.md** - Quick start guide
- **CONSOLIDATION_SUMMARY.md** - Migration details
- **README.md** - Full project documentation
- **Next.js Docs** - https://nextjs.org/docs

---

**Status:** Your Civil360 application is now a modern, single-port Next.js application! 🎉
