# CIVIL360 Startup Script
# This script starts the complete CIVIL360 platform

Write-Host "🏗️  Starting CIVIL360 - Construction Management Platform" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB connection is available
Write-Host "🔍 Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "📝 Please configure your .env file with proper MongoDB URI and other settings" -ForegroundColor Yellow
    } else {
        Write-Host "❌ .env.example not found. Please create .env file manually." -ForegroundColor Red
    }
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if dependencies are up to date
Write-Host "🔄 Checking dependencies..." -ForegroundColor Yellow
npm outdated

# Start the development server
Write-Host ""
Write-Host "🚀 Starting CIVIL360 Development Server..." -ForegroundColor Green
Write-Host "📊 General Director Dashboard: http://localhost:3001/dashboard/dg" -ForegroundColor Cyan
Write-Host "👷 Project Engineer Interface: http://localhost:3001/dashboard/engineer" -ForegroundColor Cyan  
Write-Host "🛒 Purchasing Management: http://localhost:3001/dashboard/purchasing" -ForegroundColor Cyan
Write-Host "🚛 Equipment Management: http://localhost:3001/dashboard/equipment" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Documentation: See CIVIL360_DOCUMENTATION.md" -ForegroundColor Yellow
Write-Host "🌐 API Base URL: http://localhost:3001/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "=================================================" -ForegroundColor Cyan

# Start the server with proper error handling
try {
    npm run dev
} catch {
    Write-Host ""
    Write-Host "❌ Error starting the server. Please check:" -ForegroundColor Red
    Write-Host "   • MongoDB connection in .env file" -ForegroundColor Yellow
    Write-Host "   • All dependencies are installed (npm install)" -ForegroundColor Yellow
    Write-Host "   • Port 3001 is not already in use" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For support, check the documentation or logs above." -ForegroundColor Gray
}
