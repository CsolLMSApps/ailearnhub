#!/bin/bash
# DEPLOY_QUIZ_FIX.sh
# Fixes:
#   1. Quiz not showing — was silently blocked by RLS, now uses admin client
#   2. Quiz submit broken for same reason — also uses admin client now
#   3. Progress not saving — fixed in earlier deploy (quiz submit creates progress)
#   4. Certificate auto-generates when 100% complete

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  Deploying quiz fix (admin client)"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

git add "lib/supabase/admin.ts"
git add "app/learn/[slug]/module/[number]/page.tsx"
git add "app/api/quiz/submit/route.ts"

echo "Files staged:"
git diff --cached --name-only

git commit -m "fix: use admin client for quiz fetch to bypass RLS — quizzes now visible"

echo ""
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=============================================="
echo "  DEPLOYED"
echo "=============================================="
echo ""
echo "⚠  IMPORTANT: Make sure SUPABASE_SERVICE_ROLE_KEY is in Vercel env vars!"
echo "   Vercel → Project → Settings → Environment Variables"
echo "   Add: SUPABASE_SERVICE_ROLE_KEY = your service role key"
echo ""
echo "After Vercel deploys (~2 min), test:"
echo "  1. Go to any module → quiz should appear at the bottom"
echo "  2. Pass the quiz → progress bar updates"
echo "  3. Complete all 5 → certificate auto-generates"
echo ""
