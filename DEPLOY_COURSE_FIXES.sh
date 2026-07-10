#!/bin/bash
# DEPLOY_COURSE_FIXES.sh
# Fixes:
#   1. Creates /learn/[slug] page  → fixes "Back to Course" + "Complete Course" 404
#   2. Fixes code block overflow   → content no longer bleeds off screen

set -e

PROJECT="/c/Users/Macbook/Downloads/ailearnhub-main"
cd "$PROJECT"

echo ""
echo "=============================================="
echo "  Deploying course page fixes"
echo "=============================================="
echo ""
echo "Directory: $(pwd)"

# Set git author globally
git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

# If no .git folder, initialize and connect to GitHub
if [ ! -d ".git" ]; then
  echo ""
  echo "⚠  No git repo found — initializing and connecting to GitHub..."
  git init
  git remote add origin https://github.com/CsolLMSApps/ailearnhub.git
  git fetch origin main
  # Point HEAD to origin/main without overwriting our local files
  git reset --mixed origin/main
  echo "✅  Git repo initialized and synced with origin/main"
fi

echo ""
echo "Staging changed files..."
git add "app/learn/[slug]/page.tsx"
git add "app/learn/[slug]/module/[number]/page.tsx"

echo "Files staged:"
git diff --cached --name-only

# Commit
git commit -m "fix: add course overview page and fix code block overflow"

echo ""
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=============================================="
echo "  DEPLOYED"
echo "=============================================="
echo ""
echo "Vercel will auto-deploy in ~2 minutes. Then verify:"
echo "  https://ailearnhub.io/learn/prompt-engineering-mastery"
echo "    → Should show module list + progress"
echo "  Module page 'Back to Course' button → same URL above"
echo "  Module 5 'Complete Course' button   → same URL above"
echo "  Code blocks on any module           → should not overflow"
echo ""
