#!/bin/bash
# DEPLOY_QUIZ_FIX2.sh — fixes crash when SUPABASE_SERVICE_ROLE_KEY missing from Vercel

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  Fixing admin client crash"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

git add "lib/supabase/admin.ts"

echo "Files staged:"
git diff --cached --name-only

git commit -m "fix: admin client falls back to anon key if service role key missing"

echo ""
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=============================================="
echo "  DEPLOYED — app will stop crashing now"
echo "=============================================="
echo ""
echo "NEXT STEP (required for quizzes to appear):"
echo "  1. Go to https://vercel.com → your project → Settings → Environment Variables"
echo "  2. Click 'Add New'"
echo "  3. Name:  SUPABASE_SERVICE_ROLE_KEY"
echo "  4. Value: paste your service role key (the long eyJ... key)"
echo "  5. Set Environment: Production, Preview, Development"
echo "  6. Click Save — Vercel auto-redeploys"
echo ""
echo "After that, quizzes will appear on every module page."
echo ""
