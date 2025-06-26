#!/bin/bash

echo "🚀 Starting Vercel deployment for Gagambi UI..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "⚠️ Vercel CLI not found. Installing..."
  npm install -g vercel
fi

echo "📦 Building production bundle..."
npm run build

echo "🌐 Deploying to Vercel..."
echo "When prompted:"
echo "1. Set up and deploy: Yes"
echo "2. Which scope: Your account"
echo "3. Link to existing project: No (unless you have one)"
echo "4. Project name: gagambi-frontend"
echo "5. Directory: ./"
echo "6. Override settings: No"
echo ""

vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 To set environment variables on Vercel:"
echo "1. Go to your Vercel dashboard"
echo "2. Select the gagambi-frontend project"
echo "3. Go to Settings > Environment Variables"
echo "4. Add: VITE_API_URL = your-production-api-url"
echo ""
echo "Or use the CLI:"
echo "vercel env add VITE_API_URL production"