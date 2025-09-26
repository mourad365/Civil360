# Civil360 Setup Script for Windows
Write-Host "🏗️  Civil360 Setup Script" -ForegroundColor Green
Write-Host "Installing dependencies and setting up the MongoDB backend..." -ForegroundColor Yellow

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..."
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed or accessible
Write-Host "`n🗄️  Checking MongoDB..."
try {
    $mongoVersion = mongod --version | Select-String "db version"
    if ($mongoVersion) {
        Write-Host "✅ MongoDB is installed locally" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  MongoDB not found locally. You can:" -ForegroundColor Yellow
    Write-Host "   1. Install MongoDB locally from https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "   2. Use MongoDB Atlas (cloud) - update MONGODB_URI in .env file" -ForegroundColor White
}

# Install npm dependencies
Write-Host "`n📦 Installing npm dependencies..."
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create uploads directory
Write-Host "`n📁 Creating uploads directory..."
if (!(Test-Path -Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads"
    New-Item -ItemType Directory -Path "uploads/plans"
    New-Item -ItemType Directory -Path "uploads/quality" 
    New-Item -ItemType Directory -Path "uploads/profiles"
    New-Item -ItemType Directory -Path "uploads/general"
    Write-Host "✅ Upload directories created" -ForegroundColor Green
} else {
    Write-Host "✅ Upload directory already exists" -ForegroundColor Green
}

# Check if .env file exists
Write-Host "`n⚙️  Checking environment configuration..."
if (!(Test-Path -Path ".env")) {
    Copy-Item ".env.example" -Destination ".env"
    Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
    Write-Host "📝 Please edit .env file to configure your MongoDB connection and JWT secret" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host "`n🚀 Setup Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your MongoDB connection string" -ForegroundColor White
Write-Host "2. Start MongoDB if running locally" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "4. Visit http://localhost:5000 to access the application" -ForegroundColor White
Write-Host "`nDefault login credentials:" -ForegroundColor Cyan
Write-Host "Username: marc.dubois" -ForegroundColor White
Write-Host "Password: password" -ForegroundColor White
