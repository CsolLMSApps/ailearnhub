#!/bin/bash
# ============================================================
# AILearnHub — Bug Fix Deploy Script
# Fixes: proxy.ts redirect, refund-policy double header,
#        terms 30-day vs 24-hour contradiction
# Author: Srikanth Merianda <srikanth@ctekksolutions.net>
# ============================================================

set -e

PROJECT_DIR="/c/projects/ailearnhub"
DOWNLOADS_DIR="/c/Users/Macbook/Downloads/ailearnhub-main"

echo "============================================================"
echo " AILearnHub Bug Fix Deployment"
echo "============================================================"

# --- Pre-checks ---
if [ ! -d "$PROJECT_DIR" ]; then
  echo "ERROR: Project directory not found: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"

# --- Validate git config ---
git config user.name "Srikanth Merianda"
git config user.email "srikanth@ctekksolutions.net"
echo "✅ Git identity: $(git config user.name) <$(git config user.email)>"

# --- Check we're on main and up to date ---
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ]; then
  echo "⚠️  Local is behind origin/main. Pulling latest..."
  git pull origin main
fi
echo "✅ Local matches origin/main"

# --- Backup original files ---
echo ""
echo "📦 Backing up original files..."
cp proxy.ts proxy.ts.bak
cp "app/(marketing)/terms/page.tsx" "app/(marketing)/terms/page.tsx.bak"
cp "app/(marketing)/refund-policy/page.tsx" "app/(marketing)/refund-policy/page.tsx.bak"
echo "✅ Backups created (.bak files)"

# --- Apply Fix 1: proxy.ts redirect ---
echo ""
echo "🔧 Fix 1: Correcting /login redirect to /auth/login in proxy.ts..."
cp "$DOWNLOADS_DIR/proxy.ts" proxy.ts
echo "✅ proxy.ts updated"

# --- Apply Fix 2: terms page refund period ---
echo ""
echo "🔧 Fix 2: Fixing refund period in terms/page.tsx (30-day → 24-hour)..."
cp "$DOWNLOADS_DIR/app/(marketing)/terms/page.tsx" "app/(marketing)/terms/page.tsx"
echo "✅ terms/page.tsx updated"

# --- Apply Fix 3: refund-policy double header/footer ---
echo ""
echo "🔧 Fix 3: Removing duplicate header/footer from refund-policy/page.tsx..."
cp "$DOWNLOADS_DIR/app/(marketing)/refund-policy/page.tsx" "app/(marketing)/refund-policy/page.tsx"
echo "✅ refund-policy/page.tsx updated"

# --- Build test ---
echo ""
echo "🏗️  Running npm run build..."
if npm run build; then
  echo "✅ Build passed!"
else
  echo "❌ Build FAILED — rolling back..."
  cp proxy.ts.bak proxy.ts
  cp "app/(marketing)/terms/page.tsx.bak" "app/(marketing)/terms/page.tsx"
  cp "app/(marketing)/refund-policy/page.tsx.bak" "app/(marketing)/refund-policy/page.tsx"
  echo "✅ Rollback complete. No changes pushed."
  exit 1
fi

# --- Commit and push ---
echo ""
echo "🚀 Committing and pushing to GitHub..."
git add proxy.ts "app/(marketing)/terms/page.tsx" "app/(marketing)/refund-policy/page.tsx"
git commit -m "fix: correct auth redirect, refund period, double header

- proxy.ts: redirect unauthenticated users to /auth/login (was /login)
  This fixes the broken flow for all enrolled users accessing
  /dashboard or /learn/* when not logged in
- terms/page.tsx: update refund period from 30-day to 24-hour
  to match the actual refund policy page (legal consistency)
- refund-policy/page.tsx: remove inline header and footer
  Page was rendering duplicate nav/footer because it had its own
  hardcoded header+footer AND the marketing layout was wrapping
  it with Header/Footer components"

git push origin main

echo ""
echo "============================================================"
echo " ✅ ALL FIXES DEPLOYED SUCCESSFULLY"
echo "============================================================"
echo ""
echo "Vercel will auto-deploy in ~2 minutes."
echo "Then verify at:"
echo "  https://ailearnhub.io/refund-policy  (single header now)"
echo "  https://ailearnhub.io/terms          (24-hour guarantee)"
echo "  https://ailearnhub.io/dashboard      (redirects to /auth/login)"
echo ""
echo "Backup files left in project (safe to delete later):"
echo "  proxy.ts.bak"
echo "  app/(marketing)/terms/page.tsx.bak"
echo "  app/(marketing)/refund-policy/page.tsx.bak"
