#!/bin/bash

# AI Word Processor Setup Script

echo "🚀 Setting up AI Word Processor..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your GEMINI_API_KEY"
    echo ""
    echo "To get a Gemini API key:"
    echo "1. Visit https://makersuite.google.com/app/apikey"
    echo "2. Create a new API key"
    echo "3. Copy it to your .env file"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  uvicorn main:app --reload"
echo ""
echo "Or simply:"
echo "  python main.py"
echo ""
