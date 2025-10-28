# PowerShell script to redeploy to Netlify
# Run this with: .\redeploy.ps1

Write-Host "🚀 Redeploying Civil360 to Netlify..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check for uncommitted changes
Write-Host "📋 Step 1: Checking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "✅ Found uncommitted changes. Committing..." -ForegroundColor Green
    git add .
    git commit -m "Fix Netlify deployment - remove mock-login dependency and update config"
} else {
    Write-Host "✅ No uncommitted changes found." -ForegroundColor Green
}

# Step 2: Push to remote
Write-Host ""
Write-Host "📤 Step 2: Pushing to remote repository..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to remote!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push. Check your Git configuration." -ForegroundColor Red
    Write-Host "You may need to run: git push origin master" -ForegroundColor Yellow
    exit 1
}

# Step 3: Instructions for Netlify
Write-Host ""
Write-Host "✅ Code pushed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps in Netlify Dashboard:" -ForegroundColor Cyan
Write-Host "1. Go to: https://app.netlify.com" -ForegroundColor White
Write-Host "2. Select your 'civil360' site" -ForegroundColor White
Write-Host "3. Go to: Site settings → Build & deploy" -ForegroundColor White
Write-Host "4. Click: 'Clear cache and retry deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Wait for deployment to complete (2-5 minutes)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 Then verify:" -ForegroundColor Cyan
Write-Host "   • Visit: https://civil360.netlify.app" -ForegroundColor White
Write-Host "   • Open DevTools (F12) → Network tab" -ForegroundColor White
Write-Host "   • Try to login" -ForegroundColor White
Write-Host "   • Check that /api/auth/login returns 200 or 401 (NOT 404)" -ForegroundColor White
Write-Host ""
Write-Host "✨ Done! Your changes are pushed." -ForegroundColor Green
