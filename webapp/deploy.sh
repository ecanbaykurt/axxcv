#!/bin/bash

# HealthBridge - Deployment Script for Vercel
echo "🚀 HealthBridge - Global Health Journal Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the webapp directory."
    exit 1
fi

echo "✅ Found package.json"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "📝 Creating .env.local template..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
    echo "✅ Created .env.local template"
    echo ""
    echo "🔑 IMPORTANT: Add your OpenAI API key to .env.local before deploying"
    echo "   Get your API key from: https://platform.openai.com/api-keys"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run build test
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build test successful"
else
    echo "❌ Build test failed"
    echo "   Please fix build errors before deploying"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🎉 Ready for deployment!"
echo ""
echo "🚀 Deployment Options:"
echo ""
echo "1. Vercel Dashboard (Recommended):"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Add OPENAI_API_KEY environment variable"
echo "   - Deploy!"
echo ""
echo "2. Vercel CLI:"
echo "   - Run: vercel login"
echo "   - Run: vercel"
echo "   - Follow the prompts"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🌍 Your HealthBridge will be live globally once deployed!"
