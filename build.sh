#!/bin/bash

echo "🚀 Starting Aumigo build process..."

# Show current directory and files
echo "📁 Current directory: $(pwd)"
echo "📋 Files in root:"
ls -la

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the React app
echo "🔨 Building React application..."
npm run client:build

# Check if build was successful
echo "🔍 Checking build output..."
if [ -d "dist" ]; then
    echo "📁 dist folder exists"
    ls -la dist/
    if [ -f "dist/index.html" ]; then
        echo "✅ Build successful! index.html found"
    else
        echo "❌ Build failed! dist/index.html not found"
        echo "📋 Files in dist:"
        ls -la dist/
        exit 1
    fi
else
    echo "❌ Build failed! dist folder not found"
    exit 1
fi

echo "🎉 Build process completed successfully!"