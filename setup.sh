#!/bin/bash

# Civil360 Setup Script for Unix/Linux/macOS
echo "🏗️  Civil360 Setup Script"
echo "Installing dependencies and setting up the MongoDB backend..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "\n📦 Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js is installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/${NC}"
    exit 1
fi

# Check if MongoDB is installed or accessible
echo -e "\n🗄️  Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB is installed locally${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally. You can:${NC}"
    echo -e "${WHITE}   1. Install MongoDB locally from https://www.mongodb.com/try/download/community${NC}"
    echo -e "${WHITE}   2. Use MongoDB Atlas (cloud) - update MONGODB_URI in .env file${NC}"
fi

# Install npm dependencies
echo -e "\n📦 Installing npm dependencies..."
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Create uploads directory
echo -e "\n📁 Creating uploads directory..."
if [ ! -d "uploads" ]; then
    mkdir -p uploads/{plans,quality,profiles,general}
    echo -e "${GREEN}✅ Upload directories created${NC}"
else
    echo -e "${GREEN}✅ Upload directory already exists${NC}"
fi

# Check if .env file exists
echo -e "\n⚙️  Checking environment configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
    echo -e "${YELLOW}📝 Please edit .env file to configure your MongoDB connection and JWT secret${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo -e "\n${GREEN}🚀 Setup Complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${WHITE}1. Edit .env file with your MongoDB connection string${NC}"
echo -e "${WHITE}2. Start MongoDB if running locally${NC}"
echo -e "${WHITE}3. Run 'npm run dev' to start the development server${NC}"
echo -e "${WHITE}4. Visit http://localhost:5000 to access the application${NC}"
echo -e "\n${CYAN}Default login credentials:${NC}"
echo -e "${WHITE}Username: marc.dubois${NC}"
echo -e "${WHITE}Password: password${NC}"
