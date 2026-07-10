#!/bin/bash
# DEPLOY_REVERT_ADMIN.sh — removes admin client import that was crashing the app

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  Reverting admin client — fixing crash"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

git add "app/learn/[slug]/module/[number]/page.tsx"
git add "app/api/quiz/submit/route.ts"

echo "Files staged:"
git diff --cached --name-only

git commit -m "revert: remove admin client import causing server crash"

echo ""
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=============================================="
echo "  DEPLOYED — app will load again in ~2 min"
echo "=============================================="
echo ""
echo "NEXT STEP: Fix quiz RLS in Supabase SQL Editor"
echo "  1. Go to https://supabase.com/dashboard"
echo "  2. Select your project: jqlynkmzduibfivycmze"
echo "  3. Click SQL Editor (left sidebar)"
echo "  4. Paste and run the SQL from FIX_QUIZ_RLS.sql"
echo ""
