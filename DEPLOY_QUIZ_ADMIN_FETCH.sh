#!/bin/bash
# DEPLOY_QUIZ_ADMIN_FETCH.sh
# Fixes quiz not showing by using plain-fetch admin client that bypasses RLS.
# NO createClient — avoids the previous crash (Digest 2944693851).

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  Deploying quiz RLS bypass fix"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

git add lib/supabase/admin.ts
git add "app/learn/[slug]/module/[number]/page.tsx"
git add app/api/quiz/submit/route.ts

echo "Files staged:"
git diff --cached --name-only

git commit -m "fix: use adminFetch to bypass RLS for quiz queries — no createClient"

echo ""
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=============================================="
echo "  DEPLOYED — Vercel will rebuild in ~2 min"
echo "=============================================="
echo ""
echo "What changed:"
echo "  lib/supabase/admin.ts     — plain fetch wrapper, service role key bypasses RLS"
echo "  module/[number]/page.tsx  — quiz now fetched via adminFetch (visible to user)"
echo "  api/quiz/submit/route.ts  — quiz grading also uses adminFetch"
echo ""
echo "Result: quizzes will show on every module page."
echo "        Progress bar and certificate should work after a quiz pass."
echo ""
