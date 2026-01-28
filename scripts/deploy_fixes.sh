#!/bin/bash

# =============================================================================
# DEPLOYMENT SCRIPT - AI LEARN HUB FIXES
# =============================================================================

set -e

echo "========================================================================"
echo "AI LEARN HUB - DEPLOY FIXES"
echo "========================================================================"
echo ""

# Verify we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root"
    echo "   Please run from /c/projects/ailearnhub"
    exit 1
fi

# Verify git configuration
echo "1. Verifying git configuration..."
GIT_NAME=$(git config user.name)
GIT_EMAIL=$(git config user.email)

if [ "$GIT_NAME" != "Srikanth Merianda" ] || [ "$GIT_EMAIL" != "srikanth@ctekksolutions.net" ]; then
    echo "❌ Git configuration incorrect"
    echo "   Current: $GIT_NAME <$GIT_EMAIL>"
    echo "   Expected: Srikanth Merianda <srikanth@ctekksolutions.net>"
    echo ""
    echo "Fix with:"
    echo '  git config user.name "Srikanth Merianda"'
    echo '  git config user.email "srikanth@ctekksolutions.net"'
    exit 1
fi

echo "   ✅ Git configuration correct"
echo ""

# Copy files
echo "2. Copying fix files..."

if [ -f "../proxy.ts" ]; then
    cp ../proxy.ts ./proxy.ts
    echo "   ✅ proxy.ts updated (with redirects)"
fi

if [ -f "../public/favicon.svg" ]; then
    cp ../public/favicon.svg ./public/favicon.svg
    echo "   ✅ favicon.svg added"
fi

echo ""

# Test build
echo "3. Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed"
    exit 1
fi

echo ""

# Git operations
echo "4. Committing changes..."
git add -A
git commit -m "fix: add legal page redirects, favicon, and contact link improvements

- Add 301 redirects from /terms-of-service to /terms
- Add 301 redirects from /privacy-policy to /privacy  
- Add favicon.svg for branding
- Prepare contact link fixes

This fixes 3 automated test failures and improves SEO."

echo "   ✅ Changes committed"
echo ""

# Push
echo "5. Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "   ✅ Pushed successfully"
    echo ""
    echo "========================================================================"
    echo "DEPLOYMENT INITIATED"
    echo "========================================================================"
    echo ""
    echo "Vercel will auto-deploy in 30-60 seconds"
    echo "Monitor at: https://vercel.com/srikanths-projects-69539bac/ailearnhub"
    echo ""
    echo "After deployment completes, run:"
    echo "  bash scripts/test_middleware_fix.sh"
else
    echo "   ❌ Push failed"
    exit 1
fi
