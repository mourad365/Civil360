# Civil360 Development Startup Script
Write-Host "Starting Civil360 Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Ensure we are using a compatible PowerShell version
if ($PSVersionTable.PSVersion.Major -lt 5) {
    Write-Host "This script requires PowerShell 5.0 or later." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "Node.js and npm are installed" -ForegroundColor Green

# Install dependencies if needed
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "Dependencies already installed" -ForegroundColor Green
}

# Ensure .env exists
if (-not (Test-Path -Path ".env")) {
    Write-Host ".env file not found. Checking for .env.example..." -ForegroundColor Yellow
    if (Test-Path -Path ".env.example") {
        Copy-Item -Path ".env.example" -Destination ".env" -Force
        Write-Host ".env file created from .env.example" -ForegroundColor Green
        Write-Host "Please update MongoDB credentials in the .env file if needed" -ForegroundColor Yellow
    } else {
        Write-Host ".env.example not found. Please create a .env file manually." -ForegroundColor Red
    }
} else {
    Write-Host ".env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting Civil360 in development mode..." -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5000" -ForegroundColor Blue
Write-Host "Backend API: http://localhost:3001/api" -ForegroundColor Blue
Write-Host ""
Write-Host "Demo Login Credentials:" -ForegroundColor Yellow
Write-Host "   Username: marc.dubois"
Write-Host "   Password: password"
Write-Host ""
Write-Host "Press Ctrl+C to stop the development server" -ForegroundColor Gray
Write-Host ""

# Start the development server
npm run dev
