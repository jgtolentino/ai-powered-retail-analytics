#!/bin/bash

echo "🚀 Starting Enhanced AI-Powered Scout Dashboard"
echo "==============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 System Check:${NC}"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

echo ""
echo -e "${BLUE}🏗️  Database Setup:${NC}"
echo "   To enable enhanced features, run the database migrations:"
echo -e "${YELLOW}   psql -d your_database -f database/migrations/001_scout_analytics_functions.sql${NC}"
echo -e "${YELLOW}   psql -d your_database -f database/migrations/002_rls_policies.sql${NC}"
echo -e "${YELLOW}   psql -d your_database -f database/migrations/003_materialized_views.sql${NC}"
echo ""

echo -e "${BLUE}🌐 Available Routes:${NC}"
echo "   📊 Original Dashboard:  http://localhost:5173/scout"
echo -e "${GREEN}   🚀 Enhanced Dashboard:  http://localhost:5173/scout-enhanced${NC}"
echo "   🤖 AI Genie:           http://localhost:5173/ai-genie"
echo "   📈 Analytics:          http://localhost:5173/dashboard"
echo ""

echo -e "${BLUE}✨ Enhanced Features:${NC}"
echo "   🎯 10x faster database queries"
echo "   🧠 AI-powered business insights"
echo "   🔍 Advanced filtering with persistence"
echo "   📱 Real-time analytics"
echo "   📊 Performance monitoring"
echo ""

echo -e "${GREEN}🎉 Starting development server...${NC}"
echo -e "${YELLOW}   Opening: http://localhost:5173/scout-enhanced${NC}"
echo ""

# Start the development server
npm run dev -- --open /scout-enhanced