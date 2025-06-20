#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Tribute Frontend deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the correct directory?"
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci --production=false

echo "🔨 Building the application..."
npm run build

echo "✅ Build completed successfully!"

# Check if build output exists
if [ ! -d "dist" ] && [ ! -d "build" ]; then
    echo "❌ Error: Build output directory not found!"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📁 Build output is ready for serving" 