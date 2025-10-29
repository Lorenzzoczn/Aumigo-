#!/bin/bash

echo "🚀 Starting Aumigo build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the React app
echo "🔨 Building React application..."
npm run client:build

# Check if build was successful
if [ -f "dist/index.html" ]; then
    echo "✅ Build successful! Files created:"
    ls -la dist/
else
    echo "❌ Build failed! dist/index.html not found"
    exit 1
fi

echo "🎉 Build process completed successfully!"