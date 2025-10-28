# Netlify Deployment Guide for Civil360

## Issues Fixed

### 1. ✅ Mock-Login Dependency Removed
- Removed fallback to `/api/auth/mock-login` in production
- Login now uses only the real authentication endpoint

### 2. ✅ Better Error Handling
- Added database connection error detection
- Improved error messages for users
- Added proper HTTP status codes (503 for service unavailable)

### 3. ✅ Database Initialization
- Added `initDB()` call in login route to ensure MongoDB connection

---

## Required Environment Variables on Netlify

You **MUST** configure these environment variables in your Netlify dashboard:

### Navigate to: Site Settings → Environment Variables

Add the following variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://mourad2:mourad2@cluster0.mwhno36.mongodb.net/?retryWrites=true&w=majority` | MongoDB connection string |
| `MONGODB_DB_NAME` | `civil360` | Database name |
| `JWT_SECRET` | `civil360-super-secret-jwt-key-2024-production-ready` | JWT signing secret (change in production!) |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `NODE_ENV` | `production` | Environment mode |
| `SESSION_SECRET` | `your-super-secret-session-key-change-in-production` | Session secret |

### ⚠️ Security Warning
**IMPORTANT**: The JWT_SECRET and SESSION_SECRET shown above are from your `.env.example`. 
For production, you should generate new, secure secrets:

```bash
# Generate secure secrets (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Steps to Deploy

### 1. Configure Environment Variables
1. Go to your Netlify dashboard
2. Select your site
3. Navigate to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add each variable from the table above

### 2. Ensure MongoDB Database is Populated
Make sure your MongoDB database has users. Run locally if needed:
```bash
npm run populate
```

This creates test users including:
- Username: `admin`
- Password: (check the populate.js script for the password)

### 3. Deploy to Netlify
```bash
# If using Netlify CLI
netlify deploy --prod

# Or push to your connected Git repository
git add .
git commit -m "Fix production authentication"
git push
```

### 4. Test the Deployment
1. Visit your Netlify URL: `https://civil360.netlify.app`
2. Try logging in with the credentials from your database
3. Check the browser console for any errors

---

## Troubleshooting

### Error: "Service de base de données indisponible"
**Cause**: MongoDB connection failed
**Solution**: 
- Verify `MONGODB_URI` is correctly set in Netlify environment variables
- Check MongoDB Atlas allows connections from all IPs (0.0.0.0/0) or Netlify's IPs
- Verify database user credentials are correct

### Error: "Identifiants invalides"
**Cause**: Wrong username/password or user doesn't exist in database
**Solution**:
- Run `npm run populate` locally to create test users
- Verify the database name matches `MONGODB_DB_NAME`
- Check MongoDB Atlas to confirm users exist

### Error: 500 Internal Server Error
**Cause**: Missing environment variables or code error
**Solution**:
- Check Netlify function logs: Site → Functions → View logs
- Verify all environment variables are set
- Check for any syntax errors in recent changes

### MongoDB Atlas Network Access
1. Go to MongoDB Atlas dashboard
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
5. Save

---

## Login Credentials

After running `populate.js`, you should have these test users:

- **Admin User**:
  - Username: `admin`
  - Email: `admin@civil360.com`
  - Check `populate.js` for the password

---

## Next Steps After Successful Deployment

1. **Change Secrets**: Generate new JWT_SECRET and SESSION_SECRET for production
2. **Restrict MongoDB Access**: Instead of 0.0.0.0/0, use Netlify's specific IP ranges
3. **Monitor Logs**: Check Netlify function logs regularly for errors
4. **Set up Custom Domain**: Configure your custom domain in Netlify settings
5. **Enable HTTPS**: Netlify provides free SSL certificates automatically

---

## Files Modified

1. `src/components/auth/LoginForm.tsx` - Removed mock-login fallback
2. `src/app/api/auth/login/route.ts` - Added DB init and better error handling
3. `netlify.toml` - Created Netlify configuration
4. This deployment guide

---

## Support

If you encounter issues:
1. Check Netlify function logs
2. Verify all environment variables are set
3. Test MongoDB connection from your local machine
4. Check browser console for client-side errors
