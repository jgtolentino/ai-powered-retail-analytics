# GitHub Repository Setup Guide

## Option 1: Using GitHub Web Interface (Recommended)

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top-right corner
3. **Select "New repository"**
4. **Fill in repository details:**
   - Repository name: `ai-powered-retail-analytics`
   - Description: `Philippine Retail Analytics Dashboard with Scout AI Chatbot - 18K+ transactions data visualization and AI-powered insights`
   - Set to **Public** or **Private** (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. **Click "Create repository"**

## Option 2: Using GitHub CLI (if installed)

```bash
# Install GitHub CLI first if not available
# macOS: brew install gh
# Then authenticate: gh auth login

gh repo create ai-powered-retail-analytics --public --description "Philippine Retail Analytics Dashboard with Scout AI Chatbot"
```

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-powered-retail-analytics.git

# Push your local repository to GitHub
git branch -M main
git push -u origin main
```

## Repository Features

This repository includes:

### 🎯 **Core Features**
- **Retail Analytics Dashboard** with 18K+ transaction data
- **Scout AI Chatbot** - Draggable, hideable AI assistant
- **Real-time Data Visualization** - Charts, KPIs, trends
- **Philippine Market Focus** - Sari-sari store analytics

### 📊 **Pages with Real Data**
- `/overview` - Main dashboard with KPIs and insights
- `/sales-explorer` - Transaction analysis and search
- `/scout` - Advanced 4-panel analytics view
- `/device-health` - Device performance monitoring

### 🤖 **Scout AI Features**
- **Draggable Interface** - Move anywhere on screen
- **Hide/Show Controls** - Complete visibility management
- **Contextual Insights** - Analysis of 18K+ transactions
- **Brand Intelligence** - TBWA vs competitor analysis
- **Consumer Behavior** - Pattern recognition and trends

### 🛠 **Technology Stack**
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Data:** Supabase PostgreSQL
- **AI:** Azure OpenAI GPT-4
- **Charts:** Recharts
- **State:** React Query

## Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-powered-retail-analytics.git
cd ai-powered-retail-analytics

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Azure OpenAI credentials

# Start development server
npm run dev
```

## Environment Variables Needed

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Azure OpenAI
VITE_AZURE_ENDPOINT=your_azure_endpoint
VITE_AZURE_OPENAI_API_KEY=your_azure_api_key
VITE_AZURE_DEPLOYMENT_NAME=your_deployment_name
VITE_AZURE_API_VERSION=2024-02-01
```

## Recent Updates

- ✅ **Scout AI Integration** - Added to Overview and Sales Explorer pages
- ✅ **Draggable Functionality** - Widget can be moved around screen
- ✅ **Hide/Show Controls** - Complete visibility management
- ✅ **Enhanced UX** - Better user interaction and positioning

## Demo

The application includes real Philippine retail data:
- **18,000+ transactions** from various store locations
- **Regional analysis** across Philippine provinces
- **Brand performance** tracking and comparison
- **Consumer demographics** and behavior patterns

## Contributing

This project uses Claude Code for development assistance. All major features are documented and the codebase follows modern React practices.