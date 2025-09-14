#!/bin/bash

# HealthBridge - Global Health Journal Setup Script
echo "🌍 Setting up HealthBridge - Global Health Journal"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found"
    echo "📝 Creating .env.local template..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
    echo "✅ Created .env.local template"
    echo ""
    echo "🔑 IMPORTANT: Add your OpenAI API key to .env.local"
    echo "   Get your API key from: https://platform.openai.com/api-keys"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "📚 Read the README.md for detailed usage instructions"
